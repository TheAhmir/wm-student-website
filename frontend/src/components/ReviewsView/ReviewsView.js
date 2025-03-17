import React, { useState } from "react";
import CourseReviewBaseView from "./Sections/CourseReviewView/CourseReviewBaseView";
import HousingReviewBaseView from "./Sections/HousingReviewView/HousingReviewBaseView";
import './ReviewsView.scss';

const ReviewsView = ({courseData}) => {
    const [optionSelect, setOptionSelect] = useState('courses')

    const renderSection = () => {
        switch (optionSelect) {
            case 'housing':
                return <HousingReviewBaseView />
            case 'courses':
                return <CourseReviewBaseView initialData={courseData}/>
            default:
                break;
        }
    }
    
    return (
        <div>
            <div className="review-links">
                <h3 className="section-changer" onClick={() => setOptionSelect('housing')}>Housing</h3>
                <h3 className="section-changer" onClick={() => setOptionSelect('courses')}>Courses</h3>
            </div>
            {renderSection()}

        </div>
    )
}

export default ReviewsView
