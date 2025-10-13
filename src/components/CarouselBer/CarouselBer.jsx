import React, { useRef, useState, useEffect, useContext } from 'react';
import "./CarouselBer.css";
import Eggs from "../../assets/Eggs.png";
import Milk from "../../assets/MilkPerviy.png";
import CarouselButton from "../../assets/CarouselButton.png";
import { CartContext } from '../../components/Carousel/CartContext';
import { createClient } from '@supabase/supabase-js';
import spinner from '../../assets/Spinner3.gif';

const supabaseUrl = 'https://wqhjdysjjhdyhrcgogqt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function CarouselBer() {
    const milkStuffRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const { cart, setCart } = useContext(CartContext);

    const VISIBLE = 5;
    const CARD_WIDTH = 255 + 16;

    useEffect(() => {
        console.log('SUPABASE_KEY loaded');
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('pyatorochka_products')
                    .select('*');

                if (error) {
                    console.error('Ошибка загрузки продуктов:', error.message, error.details);
                } else {
                    console.log('Загружено продуктов:', data.length, 'Данные:', data);
                    const productsWithImages = data.map((product, index) => ({
                        ...product,
                        image: index % 2 === 0 ? Eggs : Milk,
                        size: product.size || 'N/A',
                        oldPrice: 0
                    }));
                    setProducts(productsWithImages);
                }
            } catch (error) {
                console.error('Общая ошибка загрузки:', error);
            }
        };
        fetchProducts();
    }, []);

    const TOTAL_ORIGINAL = products.length;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TOTAL_ORIGINAL);
    };

    useEffect(() => {
        if (milkStuffRef.current && products.length > 0) {
            const maxTranslate = (TOTAL_ORIGINAL - VISIBLE) * CARD_WIDTH;
            const translateValue = -((currentIndex % (TOTAL_ORIGINAL - VISIBLE + 1)) * CARD_WIDTH);
            milkStuffRef.current.style.transition = 'transform 0.3s ease-in-out';
            milkStuffRef.current.style.transform = `translateX(${translateValue}px)`;
        }
    }, [currentIndex, products]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.name === product.name);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    return (
        <div className="carousel-container">
            <div className="nameOfRow">
                <h1>Молочная продукция, яйца</h1>
            </div>
            <div className="carousel-viewport">
                <div className="milk-stuff" ref={milkStuffRef}>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div className="product-container" key={index}>
                                <div className="discount">
                                    <svg width="47" height="18" viewBox="0 0 47 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 3C0 1.34315 1.34315 0 3 0H44C45.6569 0 47 1.34315 47 3V15C47 16.6569 45.6569 18 44 18H3C1.34315 18 0 16.6569 0 15V3Z" fill="#65AD55" />
                                        <path d="M14.9666 8.83452V9.89276H11.6925V8.83452H14.9666Z" fill="white" />
                                        <path d="M19.2626 5.72727V13H17.9451V7.00923H17.9025L16.2015 8.09588V6.88849L18.0091 5.72727H19.2626Z" fill="white" />
                                        <path d="M23.7974 13.1385C23.2127 13.1385 22.7108 12.9905 22.2917 12.6946C21.8751 12.3963 21.5543 11.9666 21.3294 11.4055C21.1068 10.8421 20.9956 10.1638 20.9956 9.37074C20.9979 8.57765 21.1104 7.90294 21.3329 7.34659C21.5578 6.78788 21.8786 6.36174 22.2953 6.06818C22.7143 5.77462 23.215 5.62784 23.7974 5.62784C24.3798 5.62784 24.8805 5.77462 25.2995 6.06818C25.7186 6.36174 26.0394 6.78788 26.2619 7.34659C26.4868 7.9053 26.5993 8.58002 26.5993 9.37074C26.5993 10.1662 26.4868 10.8456 26.2619 11.4091C26.0394 11.9702 25.7186 12.3987 25.2995 12.6946C24.8829 12.9905 24.3822 13.1385 23.7974 13.1385ZM23.7974 12.027C24.252 12.027 24.6106 11.8033 24.8734 11.3558C25.1386 10.906 25.2711 10.2443 25.2711 9.37074C25.2711 8.79309 25.2108 8.30777 25.09 7.91477C24.9693 7.52178 24.7988 7.22585 24.5787 7.02699C24.3585 6.82576 24.0981 6.72514 23.7974 6.72514C23.3452 6.72514 22.9877 6.95005 22.725 7.39986C22.4622 7.8473 22.3296 8.50426 22.3272 9.37074C22.3249 9.95076 22.3829 10.4384 22.5012 10.8338C22.622 11.2292 22.7924 11.5275 23.0126 11.7287C23.2328 11.9276 23.4944 12.027 23.7974 12.027Z" fill="white" />
                                        <path d="M31.6676 11.6364V11.2528C31.6676 10.9711 31.7268 10.7119 31.8452 10.4751C31.9659 10.2384 32.1411 10.0478 32.3707 9.90341C32.6004 9.759 32.8786 9.68679 33.2053 9.68679C33.5414 9.68679 33.8232 9.759 34.0504 9.90341C34.2777 10.0455 34.4493 10.2348 34.5653 10.4716C34.6837 10.7083 34.7429 10.9688 34.7429 11.2528V11.6364C34.7429 11.9181 34.6837 12.1773 34.5653 12.4141C34.447 12.6508 34.273 12.8414 34.0433 12.9858C33.8161 13.1302 33.5367 13.2024 33.2053 13.2024C32.8738 13.2024 32.5933 13.1302 32.3636 12.9858C32.134 12.8414 31.96 12.6508 31.8416 12.4141C31.7256 12.1773 31.6676 11.9181 31.6676 11.6364ZM32.5945 11.2528V11.6364C32.5945 11.8234 32.6394 11.995 32.7294 12.1513C32.8194 12.3075 32.978 12.3857 33.2053 12.3857C33.4349 12.3857 33.5923 12.3087 33.6776 12.1548C33.7652 11.9986 33.8089 11.8258 33.8089 11.6364V11.2528C33.8089 11.0634 33.7675 10.8906 33.6847 10.7344C33.6018 10.5758 33.442 10.4964 33.2053 10.4964C32.9827 10.4964 32.8253 10.5758 32.733 10.7344C32.6406 10.8906 32.5945 11.0634 32.5945 11.2528ZM27.9709 7.47443V7.09091C27.9709 6.80682 28.0312 6.5464 28.152 6.30966C28.2727 6.07292 28.4479 5.88352 28.6776 5.74148C28.9072 5.59706 29.1854 5.52486 29.5121 5.52486C29.8459 5.52486 30.1264 5.59706 30.3537 5.74148C30.5833 5.88352 30.7562 6.07292 30.8722 6.30966C30.9882 6.5464 31.0462 6.80682 31.0462 7.09091V7.47443C31.0462 7.75852 30.987 8.01894 30.8686 8.25568C30.7526 8.49006 30.5798 8.67827 30.3501 8.82031C30.1205 8.96236 29.8411 9.03338 29.5121 9.03338C29.1783 9.03338 28.8965 8.96236 28.6669 8.82031C28.4396 8.67827 28.2668 8.48887 28.1484 8.25213C28.0301 8.01539 27.9709 7.75616 27.9709 7.47443ZM28.9048 7.09091V7.47443C28.9048 7.66383 28.9486 7.83665 29.0362 7.9929C29.1262 8.14678 29.2848 8.22372 29.5121 8.22372C29.7393 8.22372 29.8956 8.14678 29.9808 7.9929C30.0684 7.83665 30.1122 7.66383 30.1122 7.47443V7.09091C30.1122 6.90152 30.0708 6.72869 29.9879 6.57244C29.9051 6.41383 29.7464 6.33452 29.5121 6.33452C29.2872 6.33452 29.1297 6.41383 29.0398 6.57244C28.9498 6.73106 28.9048 6.90388 28.9048 7.09091ZM28.3757 13L33.3757 5.72727H34.2635L29.2635 13H28.3757Z" fill="white" />
                                    </svg>
                                </div>
                                <img src={product.image} alt="" className="egg" />
                                <p className="price">{product.price_numeric || product.price}₽<span className="oldPrice">{product.oldPrice || 'N/A'}₽</span></p>
                                <p className="Name">{product.name}</p>
                                <p className="Weight">{product.size}</p>
                                <button className="add-to-cart" onClick={() => addToCart(product)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="239" height="47" viewBox="0 0 239 47" fill="none">
                                        <rect width="239" height="47" rx="7" fill="#353535"/>
                                        <path d="M117.785 33V15H120.215V33H117.785ZM110 25.2085V22.7915H128V25.2085H110Z" fill="#ADADAD"/>
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                            <img src= {spinner} alt="" />
                    )}
                </div>
            </div>
            {products.length > 0 && (
                <button className="carousel-btn" onClick={handleNext}>
                    <img src={CarouselButton} alt="Вперед" />
                </button>
            )}
        </div>
    );
}

export default CarouselBer;