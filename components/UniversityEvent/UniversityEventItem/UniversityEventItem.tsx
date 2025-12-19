import { UniversityEvent } from "../../../types/event";

interface UniversityEventItem {
    universityEvent: UniversityEvent;
    handleSelectEvent: (data: UniversityEvent) => void;
}

const UniversityEventItem = ({ universityEvent, handleSelectEvent }: UniversityEventItem) => {
    return (
        <li
            key={universityEvent.id}
            onClick={() => handleSelectEvent(universityEvent)}
            className="cursor-pointer p-4 rounded-xl shadow-md bg-white/60 backdrop-blur-md border border-gray-200
                            hover:bg-blue-50 hover:border-blue-300 transition-all"
        >
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{universityEvent.title}</span>
                <span className="text-sm text-gray-500">
                    {new Date(universityEvent.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </li>
    );
};

export default UniversityEventItem;
