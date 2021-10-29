import React from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";

import { UpstreamDatabaseProperties } from "../../types/database";
import { DatabaseClient } from "../../api/databaseClient";
import { DatabasesNavigation } from "../../constants/menu.";
import AppLayout from "../../layouts/AppLayout";
import CreateDatabaseForm from "../../components/forms/CreateDatabaseForm";

interface CreateDatabaseViewProps { }

const CreateDatabaseView: React.FC<CreateDatabaseViewProps> = () => {
  const history = useHistory();
  // Queries
  const queryClient = useQueryClient()
  const createDatabaseMutation = useMutation((database: UpstreamDatabaseProperties) => DatabaseClient.createDatabase(database), {
    onSuccess: () => {
      queryClient.invalidateQueries(["databases"])
      history.push(DatabasesNavigation.to);
    }
  })

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <CreateDatabaseForm
        processing={createDatabaseMutation.isLoading}
        errorMessage={createDatabaseMutation.isError ? "Ein Fehler is aufgetreten" : undefined}
        onSubmit={(value) => createDatabaseMutation.mutate(value)}
      />
    </AppLayout>
  );
};

export default CreateDatabaseView;
