import { UniversityEvent } from "../../../types/event";
import UniversityEventItem from "../UniversityEventItem/UniversityEventItem";

interface UniversityEventListProps {
    dayEvents: UniversityEvent[] | undefined;
    handleSelectEvent: (data: UniversityEvent) => void;
}

const UniversityEventList = ({ dayEvents, handleSelectEvent }: UniversityEventListProps) => {
    return (
        <>
            {dayEvents && (
                <div className="event-list flex flex-col items-center mt-6 w-full">
                    <h3 className="text-lg font-semibold mb-3">Події на обрану дату:</h3>

                    {dayEvents.length > 0 ? (
                        <ul className="w-full max-w-md space-y-3">
                            {dayEvents.map((item) => (
                                <UniversityEventItem
                                    key={item.id}
                                    universityEvent={item}
                                    handleSelectEvent={handleSelectEvent}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">На цю дату подій немає.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default UniversityEventList;
