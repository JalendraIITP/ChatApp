import React, { useState } from "react";
import UseContext from "./UseContext";

const UseContextProvider = ({ children }) => {
    const [idMap, setIdMap] = useState(new Map());
    const [update, setUpdate] = useState(0);
    const addObjectsToMap = (objectsArray) => {
        setIdMap(prevMap => {
            const newMap = new Map(prevMap);
            objectsArray.forEach(obj => {
                if (obj._id !== undefined) {
                    newMap.set(obj._id, obj);
                }
            });
            return newMap;
        });
    };
    const getIdMapping = (id) => {
        return idMap.get(id);
    };
    return (
        <UseContext.Provider value={{ update, setUpdate, addObjectsToMap, getIdMapping, setIdMap }}>
            {children}
        </UseContext.Provider>
    )
}
export default UseContextProvider