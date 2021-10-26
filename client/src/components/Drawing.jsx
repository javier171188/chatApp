// https://www.youtube.com/watch?v=FLESHMJ-bI0

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Context from "../context/Context";
import '../styles/components/Drawing.css';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';


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
        /*canvas.width = window.innerWidth*2;
        canvas.height = window.innerHeight*2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;*/
        


        const context = canvas.getContext("2d");
        // For hight screen density screens.
        //context.scale(2,2);
        
        context .lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 3;
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


    function sendDrawing({setDrawingAreaOn, userState, currentRoomId, event, sendNewMessage}){
        const canvas = canvasRef.current;
        setDrawingAreaOn(false);
        let imageStr = canvas.toDataURL();
        sendNewMessage(event, userState, currentRoomId, imageStr)
        
    }


    function cancelDrawing({setDrawingAreaOn}){
        setDrawingAreaOn(false);

    }

    return (
        <Context.Consumer>
            {({setDrawingAreaOn, sendNewMessage, userState, currentRoomId}) => {
                return (
                    <div className='drawing-mod'>
                        <div className='drawing-box'>
                            <h2 className='drawing-title'>{t('Draw')}</h2>
                            <canvas 
                                onMouseDown={startDrawing}
                                onMouseUp={finishDrawing}
                                onMouseMove={draw}
                                ref={canvasRef}
                                className='drawing-area'
                                id='the-drawing'
                                width="260"
                            />
                            <div className='drawing-button-container'>
                                <Button 
                                    onClick={(event)=> sendDrawing({event,
                                                                        setDrawingAreaOn, 
                                                                        sendNewMessage, 
                                                                        userState,
                                                                        currentRoomId})}
                                    color='inherit'
                                    variant='contained'
                                    className='drawing-button'
                                    id='drawing-send-button'
                                    startIcon={<SendIcon/>}
                                >
                                    {t('Send')}
                                </Button>
                                <Button
                                    onClick={() => cancelDrawing({setDrawingAreaOn})}
                                    color='inherit'
                                    variant='contained'
                                    className='drawing-button'
                                    id='cancel-drawing-button'
                                    startIcon={<CancelIcon/>}
                                >
                                    {t('Cancel')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }}
        </Context.Consumer>
    )
}

export default Drawing;