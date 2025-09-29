import "./Carousel.css";
import Eggs from "../../assets/Eggs.png";
import Discount from "../../assets/discount.png";
import CarouselButton from "../../assets/CarouselButton.png";
import React, { useRef, useState } from 'react';

function Carousel() {

    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const productWidth = 255 + 20;
    const totalProducts = 5;

    const scroll = (direction) => {
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > totalProducts - 1) newIndex = totalProducts - 1;

        setCurrentIndex(newIndex);
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(-${newIndex * productWidth}px)`;
        }
    };

    return(
        <>
        <div className="carousel-container">
            <div className="nameOfRow">
                <h1>Молоко, яйца</h1>
            </div>

            <div className="milk-stuff">
                <div className="product-container"> 
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
                <div className="product-container"> 
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
                <div className="product-container"> 
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
                <div className="product-container">
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
                <div className="product-container">
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
                <div className="product-container">
                    <img src={Discount} alt="" className="discount" />
                    <img src={Eggs} alt="" className="egg" /> 
                </div>
            </div>
            <button className="carousel-btn" onClick={() => scroll(1)}>
                <img src={CarouselButton} alt="Вперед" />
            </button>
        </div>
        </>
    );
}

export default Carousel;