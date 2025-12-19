"use client";
import React, { useState } from "react";
import { UniversityEvent } from "../../../types/event";
import { useDayEvents } from "../../../utils/query/event-query";
import ProfileBody from "../../ProfileBody/ProfileBody";
import UniversityEventList from "../../UniversityEvent/UniversityEventList/UniversityEventList";
import EventModal from "../../Modal/EventModal/EventModal";

interface MainWrapperProps {
    decode: {
        id: string;
    };
}

const MainWrapper = ({ decode }: MainWrapperProps) => {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <ProfileBody decodeToken={decode} />
        </div>
    );
};

export default MainWrapper;
