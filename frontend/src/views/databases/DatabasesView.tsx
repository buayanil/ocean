import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";

import { DatabasesNavigation } from "../../constants/menu.";
import { emptyDatabaseState } from "../../constants/empty";
import { DatabaseClient } from "../../api/databaseClient";
import AppLayout from "../../layouts/AppLayout";
import DatabaseList from "../../components/DatabaseList/DatabaseList";
import EmptyState from "../../components/EmptyState";
import Headline from "../../components/Headline";

interface DatabasesViewProps {}

const DatabasesView: React.FC<DatabasesViewProps> = () => {
  const history = useHistory();
  // Queries
  const { data: databases } = useQuery("databases", () =>
    DatabaseClient.getUserDatabases()
  );

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <div className="max-w-6xl mx-auto mt-8 mb-6 px-4  sm:px-6 lg:px-8">
        <Headline title="Databases" size="large" />
      </div>
      {(databases || []).length === 0 ? (
        <EmptyState
          {...emptyDatabaseState}
          onClick={() => history.push("/databases/new")}
        />
      ) : (
        <DatabaseList
          databases={databases || []}
          onClick={(id) => history.push(`databases/${id}`)}
        />
      )}
    </AppLayout>
  );
};

export default DatabasesView;
