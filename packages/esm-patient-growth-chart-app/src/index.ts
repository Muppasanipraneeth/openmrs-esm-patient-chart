import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';
import growthchartOverviewComponent from './growthchart/growthchart-overview.component';
import growthchartDetailedSummaryComponent from './growthchart/growthchart-detailed-summary.component';

const moduleName = '@openmrs/esm-patient-growthchart-app';

const options = {
  featureName: 'patient-growthchart',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const growthchartOverview = getSyncLifecycle(growthchartOverviewComponent, options);

export const growthchartDetailedSummary = getSyncLifecycle(growthchartDetailedSummaryComponent, options);
export const growthchartFormWorkspace = getAsyncLifecycle(
  () => import('./growthchart/growthchart-form.workspace'),
  options,
);

export const growthchartDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    moduleName,
  }),
  options,
);
