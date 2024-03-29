import { useState, useEffect } from 'react';
import { Button, Table, Skeleton, Popconfirm, message, Pagination, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '@/components/FormatCurency/formatCurency';
import { useRemoveVideoMutation } from "@/api/video";
import { Image } from 'antd';

const AdminProduct = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [productsData, setProductsData] = useState([]);
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [, setShowFullDescription] = useState(false);
    const [selectedCourseVideos, setSelectedCourseVideos] = useState([]);
    const [isVideosModalVisible, setIsVideosModalVisible] = useState(false);
    const pageSize = 3;
    const [searchTerm, setSearchTerm] = useState("");
    const showFullDescription = (courseID: any) => {
        const selectedCourse = productsData.find((product: any) => product.id === courseID);
        let isFullDescriptionVisible = true;

        const modalContent = (
            <div>
                <p>Chất liệu: {selectedCourse.chatlieu}</p>
                <p>Mô tả: {isFullDescriptionVisible ? selectedCourse.description : selectedCourse.description.slice(0, 100) + '...'}</p>
                <p>ID: {selectedCourse.id}</p>
            </div>
        );
        Modal.info({
            title: selectedCourse.courseName,
            content: modalContent,
            onOk() { },
            okButtonProps: {
                style: {
                    backgroundColor: 'green',
                    color: 'white',
                },
            },
        });
    };

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };
    const fetchData = () => {
        fetch('http://localhost:3000/Courses')
            .then((response) => response.json())
            .then((data) => {

                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const filteredData = data.filter((product) =>
                    product.courseName.toLowerCase().includes(lowerCaseSearchTerm)
                );

                setProductsData(filteredData.reverse());
                setIsProductLoading(false);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu: ', error);
                setIsProductLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };
    const showCourseVideos = (courseID: any) => {
        axios.get('http://localhost:3000/videos')
            .then((response) => {
                const allVideos = response.data;
                const videosForCourse = allVideos.filter((video: any) => video.courseId === courseID);
                setSelectedCourseVideos(videosForCourse);
                setIsVideosModalVisible(true);
            })
            .catch((error) => {
                console.error('Error fetching videos: ', error);
            });
    }
    useEffect(() => {
        fetchData();
    }, [searchTerm]);
    const handleResetSearch = () => {
        setSearchTerm("");
    };
    const [showImages, setShowImages] = useState(false);
    const handleShowImages = () => {
        setShowImages(true);
    };
    const [selectedProductImage, setSelectedProductImage] = useState('');
    // Thêm một hàm để xử lý sự kiện khi sản phẩm được bấm vào
    const handleProductClick = (imageUrls) => {
        setSelectedProductImages(imageUrls);
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '100px',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'courseName',
            key: 'name',
            width: '200px',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            width: '100px',
            render: (price: number) => {
                const formattedPrice = formatCurrency(price);
                return (
                    <>
                        {formattedPrice}
                    </>
                );
            },
        },
        {
            title: 'Thông tin sản phẩm',
            dataIndex: 'isHidden',
            key: 'isHidden',
            width: '250px',
            render: (isHidden: any, record: any) => {
                return (
                    <>
                        <Button className='ml-2' onClick={() => showFullDescription(record.id)}>
                            Mô tả chi tiết
                        </Button>
                    </>
                );
            },
        },

        {
            title: 'Hàng trong kho (chiếc)',
            dataIndex: 'soluong',
            key: 'soluong',
            width: '250px',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'courseIMG',
            key: 'courseIMG',
            render: (courseIMG: string[]) => (
                <>
                    <Button onClick={() => handleProductClick(courseIMG)}>Hiển thị hình ảnh</Button>
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isHidden',
            key: 'isHidden',
            render: (isHidden: any, record: any) => {
                const hiddenButtonClass = isHidden ? 'hidden-button' : '';

                return (
                    <>
                        <Popconfirm
                            title={isHidden ? 'Bỏ ẩn sản phẩm?' : 'Ẩn sản phẩm?'}
                            onConfirm={() => updateHiddenState(record.id, !isHidden)}
                        >
                            <Button type={isHidden ? 'dashed' : 'default'} className={hiddenButtonClass}>
                                {isHidden ? 'Đã ẩn' : 'Ẩn'}
                            </Button>
                        </Popconfirm>
                        <Button className='ml-2'>
                            <Link to={`/admin/product/${record.id}/edit`}><i className="fa-solid fa-wrench"></i></Link>
                        </Button>
                        <Button className='ml-2' onClick={() => showCourseVideos(record.id)}>
                            <i className="fa-solid fa-bars"></i>
                        </Button>
                    </>
                );
            },
        },
    ];


    const startItem = (currentPage - 1) * pageSize;
    const endItem = currentPage * pageSize;
    const currentData = productsData.slice(startItem, endItem);

    const updateHiddenState = (productId: any, isHidden: any) => {

        const updatedHiddenState = { isHidden: isHidden };

        axios
            .patch(`http://localhost:3000/Courses/${productId}`, updatedHiddenState)
            .then((response: any) => {

                const updatedProductsData = productsData.map((product: any) => {
                    if (product.id === productId) {
                        return { ...product, isHidden: isHidden };
                    }
                    return product;
                });

                setProductsData(updatedProductsData);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật trạng thái ẩn/mở sản phẩm: ', error);
            });
    };

    const handleEditVideo = (videoId: any) => {
        window.open(`http://localhost:5173/admin/video/${videoId}/edit`, '_blank');
    };



    const [deleteVideoId, setDeleteVideoId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [coursesData, setCoursesData] = useState([]);
    const [coursesData2, setCoursesData2] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);



    useEffect(() => {
        fetch('http://localhost:3000/Courses')
            .then((response) => response.json())
            .then((data) => {
                const coursesInfo = {};
                data.forEach((course: any) => {
                    coursesInfo[course.id] = course.courseName;
                });
                setCoursesData(coursesInfo);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, []);
    useEffect(() => {
        // Fetch data from 'http://localhost:3000/Courses'
        fetch('http://localhost:3000/Courses')
            .then((response) => response.json())
            .then((data) => {
                // Process and update the coursesData state as an array of objects
                const coursesInfo = data.map((course: any) => ({
                    id: course.id,
                    courseName: course.courseName,
                    duration: course.duration
                }));
                setCoursesData2(coursesInfo);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [selectedCourseId]);
    const showDeleteModal = (id: number | string) => {
        setDeleteVideoId(id);
        if (!isModalVisible) {
            setIsModalVisible(true);
        }
    };

    const [selectedProductImages, setSelectedProductImages] = useState([]);

    return (
        <div>

<Modal
    title="Hình ảnh sản phẩm"
    visible={selectedProductImages.length > 0}
    onCancel={() => setSelectedProductImages([])}
    footer={null}
>
    {selectedProductImages.map((imageUrl, index) => (
        <Image key={index} width={200} src={imageUrl} alt={`Hình ảnh sản phẩm ${index + 1}`} />
    ))}
</Modal>
            <Modal
                title={`Danh sách người mua sản phẩm !`}
                visible={isVideosModalVisible}
                onOk={() => setIsVideosModalVisible(false)}
                onCancel={() => setIsVideosModalVisible(false)}
                width={700}
                okButtonProps={{
                    style: {
                        backgroundColor: 'green',
                        color: 'white',
                    },
                }}
            >
                <ul>

                    {selectedCourseVideos.map((video: any, index: any) => (
                        <ul key={index} className='flex gap-7 p-5 items-center'>
                            <li>
                                {index + 1}
                            </li>
                            <li style={{ width: 120 }}>
                                <a className='font-bold' href={video.videoURL} target="_blank" rel="noopener noreferrer">
                                    {video.videoTitle}
                                </a>
                            </li>
                            <li>
                                <a href={video.videoURL} target="_blank" rel="noopener noreferrer">
                                    <video controls width="250" height="120">
                                        <source src={video.videoURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </a>
                            </li>
                            <li >
                                <Button className='bg-blue-800; text-black mr-3' type="primary" onClick={() => handleEditVideo(video.id)}>
                                    <i className="fa-solid fa-wrench"></i>
                                </Button>
                                <Modal
                                    title="Xác nhận xóa video"
                                    visible={isModalVisible}
                                    onOk={handleVideoDelete}
                                    onCancel={() => setIsModalVisible(false)}
                                >
                                    Bạn có chắc chắn muốn xóa video này không?
                                </Modal>
                                <Button className='text-black ' type="primary" onClick={() => {
                                    setSelectedVideoId(video.id);
                                    showDeleteModal(video.id);
                                }}>
                                    <i className="fa-solid fa-trash"></i>
                                </Button>
                            </li>
                        </ul>
                    ))}
                </ul>
            </Modal>
            <header className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">Quản lý Sản Phẩm</h2>
                <Button type="primary" danger>
                    <Link to="/admin/product/add">Thêm sản phẩm</Link>
                </Button>

            </header>
            {contextHolder}
            <Input.Search
                placeholder="Tìm kiếm theo tên sản phẩm"
                onSearch={handleSearch}
                style={{ width: 250, marginBottom: 20, marginRight: 10 }}
            />
            <Button onClick={handleResetSearch}>Tạo lại tìm kiếm</Button>

            {isProductLoading ? (
                <Skeleton />
            ) : (
                <>
                    <Table
                        pagination={false}
                        dataSource={currentData.map((item, index) => ({ ...item, stt: (startItem + index + 1).toString() }))}
                        columns={columns}
                    />
                    <Pagination
                        className='mt-2'
                        current={currentPage}
                        total={productsData.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default AdminProduct;