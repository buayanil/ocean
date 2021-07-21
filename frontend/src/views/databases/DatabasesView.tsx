import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllDatabasesStart } from "../../redux/slices/databaseSlice";
import { StoreStatus } from "../../types/models";
import { DatabasesNavigation } from "../../constants/menu.";
import { emptyDatabaseState } from "../../constants/empty";
import AppLayout from "../../layouts/AppLayout";
import DatabaseList from "../../components/DatabaseList/DatabaseList";
import EmptyState from "../../components/EmptyState";
import Headline from "../../components/Headline";

interface DatabasesViewProps {}

const DatabasesView: React.FC<DatabasesViewProps> = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { databases, status } = useAppSelector((state) => state.data.database);

  useEffect(() => {
    if (status === StoreStatus.PARTIALLY_LOADED) {
      dispatch(getAllDatabasesStart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <div className="max-w-6xl mx-auto mt-8 mb-6 px-4  sm:px-6 lg:px-8">
        <Headline title="Databases" size="large" />
      </div>
      {databases.length === 0 ? (
        <EmptyState
          {...emptyDatabaseState}
          onClick={() => history.push("/databases/new")}
        />
      ) : (
        <DatabaseList
          databases={databases}
          onClick={(id) => history.push(`databases/${id}`)}
        />
      )}
    </AppLayout>
  );
};

export default DatabasesView;
