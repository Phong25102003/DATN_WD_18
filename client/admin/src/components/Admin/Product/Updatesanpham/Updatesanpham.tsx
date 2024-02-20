import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);

    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        setLoading(true);
        // Fetch product data from the API and populate the form
        axios.get(`http://localhost:3000/product/${id}`)
            .then(response => {
                // Reset form values with product data
                reset({
                    name: response.data.name,
                    price: response.data.price,
                    img: response.data.image,
                    color: response.data.colors[0], // Assuming the first color in the array is used
                    quantity: response.data.quantity,
                  // You didn't provide author field in the JSON data, so I left it empty
                });
            })
            .catch(error => toast.error(error.message))
            .finally(() => setLoading(false)); // End loading when data is received
    }, [id, reset]);

    const onSubmit = (data: any) => {
        axios.patch(`http://localhost:3000/product/${id}`, data)
            .then(() => {
                toast.success('Product updated successfully!');
            })
            .catch(error => toast.error(error.message));
    };

    if (loading) {
        return (
            <Spin
                size="large"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            />
        );
    }

    return (
        <div className="formadd">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>
                        Product Name:
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Name is required',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.name && <div className="error">{errors.name.message}</div>}
                </div>
                <div>
                    <label>
                        Price:
                        <Controller
                            name="price"
                            control={control}
                            rules={{
                                required: 'Price is required',
                                min: { value: 0, message: 'Price must be greater than 0' },
                            }}
                            render={({ field }) => <input type="number" {...field} />}
                        />
                    </label>
                    {errors.price && <div className="error">{errors.price.message}</div>}
                </div>
                <div>
                    <label>
                        Image URL:
                        <Controller
                            name="img"
                            control={control}
                            rules={{
                                required: 'Image URL is required',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.img && <div className="error">{errors.img.message}</div>}
                </div>
                <div>
                    <label>
                        Color:
                        <Controller
                            name="color"
                            control={control}
                            rules={{
                                required: 'Color is required',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.color && <div className="error">{errors.color.message}</div>}
                </div>
                <div>
                    <label>
                        Quantity:
                        <Controller
                            name="quantity"
                            control={control}
                            rules={{
                                required: 'Quantity is required',
                                min: { value: 0, message: 'Quantity must be greater than 0' },
                            }}
                            render={({ field }) => <input type="number" {...field} />}
                        />
                    </label>
                    {errors.quantity && <div className="error">{errors.quantity.message}</div>}
                </div>
            
                <button type="submit">Update Product</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditProduct;
