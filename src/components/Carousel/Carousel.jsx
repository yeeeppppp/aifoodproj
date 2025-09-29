import "./Carousel.css";
import Eggs from "../../assets/Eggs.png";
import Discount from "../../assets/discount.png";
import CarouselButton from "../../assets/CarouselButton.png";
import React, { useRef, useState } from 'react';

function Carousel() {

    const milkStuffRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const TOTAL = 10;
    const VISIBLE = 5
    const CARD_WIDTH = 255 + 16;
    const handleNext = () => {
        const newIndex = (currentIndex + 1) % TOTAL; // ← бесконечный цикл
        setCurrentIndex(newIndex);

        if (milkStuffRef.current) {
            milkStuffRef.current.style.transform = `translateX(-${newIndex * CARD_WIDTH}px)`;
        }
    };

    return(
        <>
        <div className="carousel-container">
            <div className="nameOfRow">
                <h1>Молоко, яйца</h1>
            </div>

            <div className="carousel-viewport">
                <div className="milk-stuff" ref={milkStuffRef}>
                    <div className="product-container"> 
                        <img src={Discount} alt="" className="discount" />
                        <img src={Eggs} alt="" className="egg" /> 
                        <p className="price">190₽</p>
                        <div className="old-price">
                            <span>290₽</span>
                        </div>
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
            </div>

            <button className="carousel-btn" onClick={handleNext}>
                <img src={CarouselButton} alt="Вперед" />
            </button>
        </div>
        </>
    );
}

export default Carousel;