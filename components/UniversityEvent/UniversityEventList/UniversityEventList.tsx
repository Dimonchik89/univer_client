import { UniversityEvent } from "../../../types/event";
import UniversityEventItem from "../UniversityEventItem/UniversityEventItem";

interface UniversityEventListProps {
    dayEvents: UniversityEvent[] | undefined;
    handleSelectEvent: (data: UniversityEvent) => void;
}

const UniversityEventList = ({ dayEvents, handleSelectEvent }: UniversityEventListProps) => {
    return (
        <>
            {dayEvents && dayEvents.length > 0 ? (
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
        </>
    );
};

export default UniversityEventList;
