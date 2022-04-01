import { useHistory } from "react-router-dom";

function Conference() {
    const history = useHistory();

    function hangUp() {
        history.push('/chat/');
    }
    return (<>
        <div id="app">
            <h1 className="centered test-title red-text">Conference</h1>
            <div className="conference-section">
                <div id="publisher-container" className="publisher-section publisher-container">
                    <div className="settings-area">
                        <p>
                            <label htmlFor="room-field" className="settings-label">Room:</label>
                            <input id="room-field" name="room-field" className="settings-input" />
                        </p>
                    </div>
                    <div id="publisher-session" className="publisher-session hidden">
                        <p id="status-field" className="centered status-field">On hold.</p>
                        <p id="statistics-field" className="centered status-field statistics-field hidden">
                            {/* only updated from WebRTC clients. */}
                            Bitrate: <span id="bitrate-field" className="bitrate-field">N/A</span>.&nbsp;
                            Packets Sent: <span id="packets-field" className="packets-field">N/A</span>.
                            <br />
                            <span>Resolution: <span id="resolution-field" className="resolution-field">0x0</span>.
                            </span></p>
                    </div>
                    <div className="centered video-holder">
                        <video id="red5pro-publisher" className="red5pro-publisher" controls autoPlay playsInline muted width={320} height={240}>
                        </video>
                    </div>
                    <div id="publisher-settings" className="publisher-settings">
                        <p className="remove-on-broadcast">
                            <label className="device-label" htmlFor="streamname-field">Stream Name:</label>
                            <input id="streamname-field" name="streamname-field" className="settings-input" />
                        </p>
                        <hr className="paddedHR" />
                        <p>
                            <label className="device-label" htmlFor="camera-select">Camera:</label>
                            <select className="control device-control settings-input" name="camera-select" id="camera-select" />
                        </p>
                        <p>
                            <label className="device-label" htmlFor="microphone-select">Microphone:</label>
                            <select className="control device-control settings-input" name="microphone-select" id="microphone-select" />
                        </p>
                        <p id="publisher-mute-notice" className="publisher-mute-notice remove-on-broadcast">
                            <span className="device-info">Video and Audio can be turned off after publish has started.</span>
                        </p>
                        <p id="publisher-mute-controls" className="publisher-mute-controls hidden">
                            <label htmlFor="video-check">Video: </label>
                            <input type="checkbox" id="video-check" name="video-check" defaultChecked />
                            <label htmlFor="audio-check">Audio: </label>
                            <input type="checkbox" id="audio-check" name="audio-check" defaultChecked />
                        </p>
                        <p id="publisher-name-field" className="publisher-name-field hidden" />
                        <div className="remove-on-broadcast">
                            <button
                                id="hang-button"
                                className="ui-button"
                                onClick={hangUp}>hang up</button>
                        </div>
                    </div>
                </div>
                <div id="subscribers" className="subscribers" />
            </div>
        </div>

    </>)
}

export default Conference;