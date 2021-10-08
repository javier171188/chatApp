// https://www.youtube.com/watch?v=FLESHMJ-bI0

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Context from "../context/Context";

const Drawing = () => {
    const { t, i18n } = useTranslation();
    //To preserve info between renders
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect( () => {
        const canvas = canvasRef.current;

        // This part is supposed to make it work with 
        //screens with hight screen density.
        canvas.width = window.innerWidth*2;
        canvas.height = window.innerHeight*2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;


        const context = canvas.getContext("2d");
        // For hight screen density screens.
        context.scale(2,2);
        
        context .lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;

    }, [])
    
    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);    
        setIsDrawing(true);
    }
    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false);
    }
    const draw = ({nativeEvent}) => {
        if (!isDrawing){
            return;
        }
        
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    }
    return (
        <Context.Consumer>
            {() => {
                return (
                    <>
                    <h1>{t('Draw')}</h1>
                    <canvas 
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        ref={canvasRef}
                    />

                    
                    <div>options</div>
                    </>
                )
            }}
        </Context.Consumer>
    )
}

export default Drawing;