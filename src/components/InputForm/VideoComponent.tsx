import React, {useEffect, useRef} from 'react';

interface VideoComponentProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videoRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (video && canvas && ctx) {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;

            video.addEventListener('play', () => {
                const draw = () => {
                    if (!video.paused && !video.ended) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.beginPath();
                        ctx.moveTo(canvas.width / 2, 0);
                        ctx.lineTo(canvas.width / 2, canvas.height);
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        setTimeout(draw, 20);
                    }
                };
                draw();
            });
        }
    }, [videoRef]);

    return (
        <div style={{ position: 'relative', width: '50vw' }}>
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        </div>
    );
};

export default VideoComponent;
