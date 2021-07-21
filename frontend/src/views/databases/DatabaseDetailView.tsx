import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DatabaseIcon } from "@heroicons/react/outline";

import { DatabaseProperties, HostProperties } from "../../types/models";
import { DatabasesNavigation } from "../../constants/menu.";
import { tabs } from "../../constants/tabs";
import { deleteModalContent } from "../../constants/modals";
import AppLayout from "../../layouts/AppLayout";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteDatabaseStart,
  getDatabaseStart,
} from "../../redux/slices/data/databaseSlice";
import TabList from "../../components/TabList";
import ActionDropdown from "../../components/ActionDropdown";
import DeleteModal from "../../components/DeleteModal";
import OverviewCard from "../../components/OverviewCard";
import { getDatabaseEngineTitle } from "../../components/DatabaseList/DatabaseList";
import Alert from "../../components/Alert";

const {
  REACT_APP_POSTGRESQL_HOSTNAME,
  REACT_APP_POSTGRESQL_PORT,
  REACT_APP_MONGODB_HOSTNAME,
  REACT_APP_MONGODB_PORT,
} = process.env;

interface DatabaseDetailViewProps {}

const DatabaseDetailView: React.FC<DatabaseDetailViewProps> = () => {
  let { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { loading, error, databases } = useAppSelector(
    (state) => state.data.database
  );
  const { user } = useAppSelector((state) => state.data.user);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deleteProcess, setDeleteProcess] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getDatabaseStart(Number.parseInt(id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!loading && deleteProcess) {
      setDeleteProcess(false);
      setOpenModal(false);
      const deleted = !databases.some(
        (database) => database.id === Number.parseInt(id)
      );
      if (error === undefined && deleted) {
        history.push("/databases");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onSubmit = () => {
    setDeleteProcess(true);
    dispatch(deleteDatabaseStart(Number.parseInt(id)));
  };

  const renderTabContent = (): React.ReactNode => {
    const database = databases.find(
      (database) => database.id === Number.parseInt(id)
    );
    if (selectedId === 1) {
      return (
        <OverviewCard
          database={database}
          host={database ? getHostFor(database) : undefined}
          user={user}
        />
      );
    } else if (selectedId === 2) {
      return <div>UserCard</div>;
    }
  };

  const getHostFor = (
    database: DatabaseProperties
  ): HostProperties | undefined => {
    if (database.engine === "P") {
      return {
        hostname: REACT_APP_POSTGRESQL_HOSTNAME || "",
        port: Number.parseInt(REACT_APP_POSTGRESQL_PORT || "5432"),
      };
    } else if (database.engine === "M") {
      return {
        hostname: REACT_APP_MONGODB_HOSTNAME || "",
        port: Number.parseInt(REACT_APP_MONGODB_PORT || "27017"),
      };
    }
  };

  // TODO: selector for a single database
  const database = databases.find(
    (database) => database.id === Number.parseInt(id)
  );

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <div className="flex space-x-3 mb-4">
        <div className="flex-shrink-0">
          <DatabaseIcon className="h-10 w-10 rounded-full text-cyan-600" />
        </div>
        <div className="min-w-0 flex-1">
          {database ? (
            <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {database.name}
            </div>
          ) : (
            <div className="animate-pulse mt-1 h-6 w-36 bg-gray-200" />
          )}
          {database ? (
            <div className="text-sm text-gray-500">
              {getDatabaseEngineTitle(database.engine)}
            </div>
          ) : (
            <div className="animate-pulse mt-1 h-4 w-24 bg-gray-200" />
          )}
        </div>
        <div className="flex-shrink-0 self-center flex">
          <ActionDropdown onDelete={() => setOpenModal(true)} />
        </div>
      </div>
      <Alert errorMessage={error} />
      <TabList
        tabs={tabs}
        selectedId={selectedId}
        onSelect={(value) => setSelectedId(value)}
      />
      <div className="mt-4">{renderTabContent()}</div>
      {/*Modal area*/}
      <DeleteModal
        open={openModal}
        modalContent={deleteModalContent}
        onSubmit={onSubmit}
        onClose={() => setOpenModal(false)}
      />
    </AppLayout>
  );
};

export default DatabaseDetailView;
