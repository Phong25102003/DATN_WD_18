import React, { useState, useEffect } from 'react';
import { Button, Table, Skeleton, message, Pagination, Modal, Select } from "antd";
import { useGetPaymentsQuery } from "@/api/payment";
import { useGetUsersQuery } from "@/api/user";

const { Option } = Select;

const AdminPayment = (props: any) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: ordersData, isLoading: isOrderLoading } = useGetPaymentsQuery();
    const { data: usersData } = useGetUsersQuery();
    const [courses, setCourses] = useState<any[]>([]);
    const [userDetailVisible, setUserDetailVisible] = useState(false);
    const [currentUserDetail, setCurrentUserDetail] = useState<any>(null);

    useEffect(() => {
        // Fetch course data when component mounts
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:3000/Courses");
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                throw new Error("Failed to fetch courses");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const userMap = new Map(usersData?.map((item: any) => [item.id, item.displayName]));

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (text: any, record: any, index: number) => index + 1,
        },
        {
            title: "Người đặt hàng",
            dataIndex: "userId",
            key: "userId",
            render: (userId: string) => {
                const displayName = userMap.get(userId);
                return displayName;
            },
        },
        {
            title: "   Chi tiết",
            dataIndex: "userId",
            key: "userDetail",
            render: (userId: string) => (
                <Button type="link" onClick={() => showUserDetail(userId)}>Chi tiết</Button>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "items",
            key: "items",
            render: (items: any[]) => (
                <div>
                    {items.map((item: any, index: number) => {
                        const course = courses.find(course => course.id === item.productId);
                        return (
                            <div key={index}>
                                <div className='flex pro-cr'>
                                    {course && course.courseIMG ? (
                                        <img width={120} src={course.courseIMG[0]} alt="" />
                                    ) : (
                                        <div>No image available</div>
                                    )}
                                    <div>
                                        <p className='font-medium'>{course?.courseName || 'Unknown Course'}</p>
                                        <p>Mã đơn hàng: {item.productId}</p>
                                        <p>Size: {item.size}</p>
                                        <p>Màu: {item.color}</p>
                                        <p>Số lượng: {item.quantity}</p>
                                        <p>Giá tiền: <span className='text-red-500 font-medium'> {course ? course.price : 'Unknown Price'}đ</span></p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string, record: any) => (
                <Select defaultValue={status} onChange={(value) => updateOrderStatus(record.id, value)}>
                    <Option value="Đã thanh toán">Đã thanh toán</Option>
                    <Option value="Chờ xác nhận">Chờ xác nhận</Option>
                    <Option value="Đang vận chuyển">Đang vận chuyển</Option>
                    <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
            ),
        },
    ];

    const showUserDetail = (userId: string) => {
        const userDetail = usersData.find((user: any) => user.id === userId);
        if (userDetail) {
            setCurrentUserDetail(userDetail);
            setUserDetailVisible(true);
        }
    };

    const handleCancel = () => {
        setUserDetailVisible(false);
    };

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        // Implement logic to update order status in backend or local state
        console.log("Updating order status:", orderId, newStatus);
        // Send PATCH request to update order status
        fetch(`http://localhost:3000/Payment/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            // Reload page or update state as needed
            window.location.reload();
        })
        .catch(error => {
            console.error('Error updating order status:', error);
            // Handle error as needed
        });
    };

    const pageSize = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const startItem = (currentPage - 1) * pageSize;
    const endItem = currentPage * pageSize;
    const currentData = ordersData?.slice(startItem, endItem);

    return (
        <div>
            <header className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">Quản lý Đơn hàng</h2>
            </header>
            {contextHolder}
            {isOrderLoading ? <Skeleton /> : (
                <>
                    <Table
                        pagination={false}
                        dataSource={currentData}
                        columns={columns}
                    />
                    <Pagination
                        className="mt-4"
                        current={currentPage}
                        total={ordersData?.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                    <Modal
                        title="Chi tiết"
                        visible={userDetailVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        {currentUserDetail && (
                            <div>
                                <p><strong>Tên người dùng:</strong> {currentUserDetail.displayName}</p>
                                <p><strong>Email:</strong> {currentUserDetail.email}</p>
                                <p><strong>Số điện thoại:</strong> {currentUserDetail.phone}</p>
                                <p><strong>Địa chỉ:</strong> {currentUserDetail.address}</p>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminPayment;
