import React, { useState, useEffect, useRef } from "react";
import { trackUserChanges } from "../FirebaseAuth/AuthMethods"; 
import './ShopView.scss'

const ShopView = ({initialData}) => {
    const [user, setUser] = useState();
    const recent_filler = Array(7).fill(null)
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const inputRef = useRef("")
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setData(initialData)
    }, [initialData])
    
    useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = trackUserChanges(setUser);

    // Clean up subscription on unmount
    return () => unsubscribe();
    }, []);

    useEffect(() => {
        const data_filter = data.filter(row => {
            return row.title.toLowerCase().includes(searchInput.toLowerCase())
        })

        setFilteredData(data_filter)
        
    }, [searchInput, data])
    
    

    return (
        <div className="shop-page">
            <h1>Textbooks</h1>
            {/*<p>Recently added</p>
            <div className="recent">
                {recent_filler.map((_, index) => (
                    <div className="recent-element" key={index}>
                        <img src="/textbook.jpg" alt="recent-image"/>
                        <p>Science for Lower Secondary</p>
                        <p>Price: ${10.00 + index}</p>
                    </div>
                ))} 
            </div>
*/}
            <div className="container">
                <div className="course-search" onClick={() => {inputRef.current.focus()}}>
                    <label>Search</label>
                    <input className="course-search-input"
                    type="text"
                    ref={inputRef}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoComplete="off"
                    onfocus="this.removeAttribute('readonly');"/>
                </div>
            
                <div className="main-search">
                {filteredData.map((element, index) => (
                        <div className="shop-items-container">
                            <div className="main-element" key={index}>
                                <p className="item-title">{element["title"]}</p>
                                <div className="image-container">
                                    <img className="first-image" src={element["images"][0]['url']} alt="search-image"/>
                                </div>
                                <div className="context">
                                    <p>Price: ${element["price"]}</p>
                                    <p>Description: {element["description"]}</p>
                                </div>
                            </div>
                        </div>
                    ))} 
                </div>
                {user && (<i className="pi pi-plus shop-add" style={{ fontSize: '2rem' }}></i>)}
            
            </div>
        </div>
    )
}
export default ShopView;
