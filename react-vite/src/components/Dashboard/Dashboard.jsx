import { useState } from "react";
import Sidebar from "../Sidebar";
import MainContent from "../MainContent";
import BoardDetails from "../BoardDetails";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("boards");
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  return (
      <div className="dashboard-container">
        <Sidebar
          onBoardsClick={() => {
            setActiveView("boards");
            setSelectedBoardId(null);
          }}
          onBoardSelect={(boardId) => {
            setActiveView("boardDetails");
            setSelectedBoardId(boardId);
          }}
        />
        {activeView === "boards" ? (
          <MainContent
            onBoardSelect={(boardId) => {
              setActiveView("boardDetails");
              setSelectedBoardId(boardId);
            }}
          />
        ) : (
          <BoardDetails boardId={selectedBoardId} />
        )}
      </div>
  );
}
