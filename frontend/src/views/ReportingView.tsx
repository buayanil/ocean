import React from "react";

import AppLayout from "../layouts/AppLayout";
import Headline from "../components/Headline";
import { ReportingNavigation } from "../constants/menu.";
import { IStats, Stats } from "../components/Stats/Stats";
import { useMetricsQuery } from "../hooks/useMetricsQuery";
import { useDatabasesQuery } from "../hooks/useDatabaseQuery";
import { DatabaseAdminList } from "../components/DatabaseAdminList/DatabaseAdminList";

interface ReportingViewProps {}

const ReportingView: React.FC<ReportingViewProps> = () => {
  const metricsQuery = useMetricsQuery();
  const metrics = metricsQuery.data;
  const databasesQuery = useDatabasesQuery();
  const databases = databasesQuery.data || [];

  const getStats = () => {
    const result: IStats[] = [];
    if (metrics) {
      result.push({
        name: "Total Databases",
        value: metrics.totalInstances.toLocaleString(),
      });
      result.push({
        name: "Total Users",
        value: metrics.totalUsers.toLocaleString(),
      });
    }

    return result;
  };

  const render = (): React.ReactElement => {
    return (
      <AppLayout selectedNavigation={ReportingNavigation.name}>
        <div>
          <Headline title="Reporting" size="large" />
          {renderMetrics()}
          {renderDatabases()}
        </div>
      </AppLayout>
    );
  };

  const renderMetrics = (): React.ReactElement => {
    return (
      <div>
        <h2 className="mt-5 text-2xl leading-6 font-medium text-gray-900">
          Metrics: Total
        </h2>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {getStats().map((item, index) => (
            <Stats key={index} name={item.name} value={item.value} />
          ))}
        </dl>
      </div>
    );
  };

  const renderDatabases = (): React.ReactElement => {
    return (
      <div>
        <h2 className="mt-5 text-2xl leading-6 font-medium text-gray-900">
          All Databases
        </h2>
        <DatabaseAdminList databases={databases} />
      </div>
    );
  };

  return render();
};

export default ReportingView;
