import './Listproduct.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Table, Button, Space, Modal } from 'antd';
import { Spin } from 'antd';
import axios from 'axios';

const Listproduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        axios.get('http://localhost:3000/product')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: '',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img width={120} src={text} alt="" />,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 220
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số lượng trong kho',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {/* Use Link to navigate to the edit page */}
                    <Link to={`/admin/suasanpham/${record.id}`}>
                        <Button className='bg-blue-500 text-white' type="primary">Sửa</Button>
                    </Link>
                    <Button className='bg-red-500 text-white' type="danger" onClick={() => handleDelete(record)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.name}" không?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                setLoading(true);
                axios.delete(`http://localhost:3000/product/${record.id}`)
                    .then(() => {
                        // Xóa sản phẩm khỏi danh sách và cập nhật trạng thái loading
                        setProducts(products.filter(item => item.id !== record.id));
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
                        setLoading(false);
                    });
            },
        });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = products.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Link className='btn-neutral p-2' style={{ borderRadius: 4 }} to="/admin/addsanpham">Thêm sản phẩm mới!</Link>

            {loading ? (
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                />
            ) : (
                <>
                    <Table columns={columns} dataSource={currentItems} />
                    <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        total={totalItems}
                        pageSize={itemsPerPage}
                    />
                </>
            )}
        </div>
    );
};

export default Listproduct;
