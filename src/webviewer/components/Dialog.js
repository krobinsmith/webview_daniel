import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

function Dialog(props){
    const [serieses, setSeries] = useState([]);
    const [thumbLists, setThumb] = useState(null);
    const location = useLocation();
    const st_id = new URLSearchParams(location.search).get('st_id');
    const il = new URLSearchParams(location.search).get('il');

    const handleDragStart = (event, id) => {
        event.dataTransfer.setData("id", id);
    }

    useEffect(() => {
        if (serieses == undefined) return;
        if (serieses.length == 0) {
            fetch(  
                `/api/series?filter[study_id]=${st_id}`,
                {
                    headers: {
                        Authorization: `${localStorage.getItem("SavedToken")}`, 
                    },
                }
            )
            .then(response => response.json())
            .then(json => {
                setSeries(json.data);
            });
        } else {
            if (serieses[0].thumbnails == undefined) {
                serieses.map((series, index) => {
                    var base64data = '';
                    fetch(
                        `/api/images/thumbnails/${series.id}`,
                        {
                            headers: {
                                Authorization: `${localStorage.getItem("SavedToken")}`, 
                            },
                        }
                    )
                        .then((res) => res.blob())
                        .then((blob) => {
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                base64data = reader.result;
                                serieses[index]['thumbnails'] = base64data;
                                if (index == serieses.length - 1) {
                                    setThumb(
                                        serieses.map(series => {
                                            return(
                                                <div 
                                                onDragStart = {(event) => handleDragStart(event, series.id)}
                                                    key={series.id} className="item draggable ui-draggable" draggable="true">
                                                    <div className="imgListItem zfpThumbnail btnPressed" draggable="true">
                                                        <img id="img353" src={series.thumbnails} style={{ width: "70px", height: "70px" }}/>
                                                        <br/>
                                                        <span id="descr353" className="imgListCaptionDescr">{series.num_instances}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    );
                                }
                            };
                        });
                });
            }
        }
    }, [serieses]);

    return (
        <div id="DialogContainer">
            <div className="rCaption">Series</div>
            <div className="studyHeader studyHeaderSelected">
                <div className="minus"></div>
                DENTAL<br/>02-фев-2015 00:00:00
            </div>
            { thumbLists }
        </div>
    )
}

export default Dialog;