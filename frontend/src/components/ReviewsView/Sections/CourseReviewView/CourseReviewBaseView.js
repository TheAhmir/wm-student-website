import React, { useEffect, useState } from "react";
import './CourseReviewBaseView.scss';
import { Link } from 'react-router-dom';

const CourseReviewBaseView = ({initialData}) => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [prefixText, setPrefixText] = useState('')
    const [codeText, setCodeText] = useState('')
    const [titleText, setTitleText] = useState('')
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setData(initialData)
    }, [initialData]);

    useEffect(() => {
        const data_filter = data.filter(row =>
        (prefixText ? row['prefix'].toLowerCase().includes(prefixText.toLowerCase()) : true ) &&
        (codeText ? row['code'].includes(codeText) : true) &&
        (titleText ? row['title'].toLowerCase().includes(titleText.toLowerCase()) : true)
        );
        setFilteredData(data_filter)

        setCurrentPage(0)
    }, [prefixText, codeText, titleText, data])
    
    useEffect(() => {
        const pages = Math.floor(filteredData.length / 15);
        setNumPages(pages)
    }, [filteredData])
    return (
        <div>
            <form className="search">
                <div className="input-group">
                    <label>Prefix:</label>
                    <input
                    type="text"
                    value={prefixText}
                    onChange={(e) => setPrefixText(e.target.value)}></input>
                </div>
                <div className="input-group">
                    <label>Code:</label>
                    <input
                    type="text"
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}></input>
                </div>
                <div className="input-group">
                    <label>Title</label>
                    <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}></input>
                </div>
            </form>
            <div className="insights-link-container">
                <a href="/reviews/course-insights" className="insights-link">
                    <h2 className="insights-link-text">Fun Insights!</h2>
                </a>
            </div>
            <h1>Courses</h1>
            <div className="filtered-classes">
            {filteredData.map((row, index) => (
                currentPage === 0 ? index <= 15 &&(
                    <Link 
                    to={`/reviews/courses/${row['prefix']}-${row['code']}-${row['title'].replace(/\s+/g, '-').replace('?', '')}`}
                    state={{ course : row }}
                    key={index}
                    className="course-link">
                    <p className="course-link-text"><span className="course-meta">{row['prefix']} {row['code']}</span> - {row['title']}</p>
                    <p className="course-link-text review-count"><span className="course-meta">{row['num_reviews']}</span>&nbsp;reviews</p>
                    </Link>
                ) :
                index > currentPage * 15 && index <= (currentPage + 1) * 15 && (
                    <Link 
                    to={`/reviews/courses/${row['prefix']}-${row['code']}-${row['title'].replace(/\s+/g, '-').replace('?', '')}`}
                    state={{ course : row}}
                    key={index}
                    className="course-link">
                    <p className="course-link-text"><span className="course-meta">{row['prefix']} {row['code']}</span> - {row['title']}</p>
                    <p className="course-link-text review-count"><span className="course-meta">{row['num_reviews']}</span>&nbsp; reviews</p>
                    </Link>
                )
            ))}
            </div>
            <div className="page-buttons">
            {filteredData.length !== 0 && (
                <>
                {currentPage > 5 && (
                <>
                <p className="index" onClick={() => setCurrentPage(0)}>0</p>
                <p>...</p>
                </>
            )}
            {Array.from({length: numPages}, (_, index) => (index >= currentPage - 5 && index <= currentPage + 5) && (
                <p className={index === currentPage ? 'index curPage' : 'index'} onClick={() => setCurrentPage(index)}>{index}</p>
            ))}
            {currentPage < numPages - 5 && (
                <>
                <p>...</p>
                <p className="index" onClick={() => setCurrentPage(numPages - 5)}>{numPages - 5}</p>
                </>
            )}
            </>
            )}
            </div>
        </div>
    )
}

export default CourseReviewBaseView
