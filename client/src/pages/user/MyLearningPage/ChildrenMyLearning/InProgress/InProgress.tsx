import { useState, useEffect } from 'react';
import { firebaseConfig } from '@/components/GetAuth/firebaseConfig';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Empty } from 'antd';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const InProgress = () => {
    const [orders, setOrders] = useState([]);
    const [courses, setCourses] = useState({});
    const [test, setTest] = useState();

    const [email, setEmail] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
            setEmail(currentUser?.email);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (email) {
            fetch(`http://localhost:3000/googleAccount?email=${email}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch user data from API.');
                    }
                })
                .then((userDataArray) => {
                    if (userDataArray.length > 0) {
                        const userData = userDataArray[0];
                        setUserID(userData.id);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [email]);
    console.log(userId);

    useEffect(() => {
        fetch(`http://localhost:3000/Payment`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch orders');
            })
            .then(data => {
                // Filter orders based on userId
                const filteredOrders = data.filter(order => order.userId === userId);
                // Reverse the order of the filteredOrders array
                filteredOrders.reverse();
                // Kiểm tra và xử lý cấu trúc không đồng nhất của items
                filteredOrders.forEach(order => {
                    if (typeof order.items === 'string') {
                        order.items = JSON.parse(order.items);
                    }
                });
                setOrders(filteredOrders);
                setLoading(false);
                
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        fetch("http://localhost:3000/Courses")
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch courses');
            })
            .then(data => {
                // Reverse the order of the courses array
                data.reverse();
         
                setTest(data)
                const coursesMap = {};
                data.forEach(course => {
                    coursesMap[course.id] = course;
                });
                setCourses(coursesMap);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const cancelOrderAndUpdateStatus = (orderId) => {
        // Call the updateOrderStatus function to update the order status
        updateOrderStatus(orderId, 'Đơn hàng đã hủy');
    };

    const updateOrderStatus = (orderId, newStatus) => {
        // Implement your updateOrderStatus function here
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
                // Assuming you want to refresh the page after updating the status
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating order status:', error);
                // Handle errors or display a message to the user if necessary
            });
            
    };
    return (
        <div className='orders'>
            {orders.length > 0 ? (
                <ul>
                    {orders.map(order => {

                        

                       
                   

                        // Check if the order status is one of the statuses you want to exclude
                        if (order.status === "Đơn hàng đã được giao thành công" || order.status === "Đơn hàng đã hủy") {
                            // If the status matches, don't render this order
                            return null;
                        }
                        // If the status doesn't match, render the order
                        return (
                            <li className='ord-map' style={{ width: 700 }} key={order.id}>
                                <h3 className='text-xs ml-12 mb-3'>Mã đơn hàng: {order.id}</h3>
                                <ul>
                                    {order.items.map((item: any, index: any) => {
                                      
                            

                                        return (
                                            <li key={index}>
                                                <div className='flex pro-cr'>
                                                    {courses[item.productId] && courses[item.productId].courseIMG ? (
                                                        <img width={120} src={courses[item.productId].courseIMG[0]} alt="" />
                                                    ) : (
                                                        <div>No image available</div>
                                                    )}
                                                    <div>
                                                        <p className='font-medium'>{courses[item.productId]?.courseName || 'Unknown Course'}</p>
                                                        Kích cỡ: {item.size}, Màu sắc: {item.color}, Số lượng: {item.quantity} đôi
    
                                                        <div className='flex'> 
                                                      

                                                        <p>Giá Tiền: <span className='text-red-500 font-medium'>{test?.filter(items1=>items1.id ==item.productId ).map((db2)=>db2.price?.toLocaleString())}đ</span></p>
                                                        
                                                        </div>
                                                  
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}

                                </ul>
                                <div className='ml-12'>
                                    <p>Thành tiền: <span className='text-red-500 font-medium'>đ{order.amount}</span></p>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className='text-green-600 font-medium'> <i className="fa-solid fa-truck-fast"></i> {order.status}</p>
                                            <p className='text-sm'>Trạng thái thanh toán: {order.status2}</p>
                                            <p className='text-sm'>Trạng thái thanh toán: {order.option}</p>
                                            <button className='bg-red-500 text-white p-2' onClick={() => cancelOrderAndUpdateStatus(order.id)}>Cancel Order</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

            ) : (
                <Empty className='mt-20' />
            )}
        </div>
    );
};

export default InProgress;