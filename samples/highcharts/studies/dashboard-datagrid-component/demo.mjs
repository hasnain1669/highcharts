// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugin/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/es-modules/Extensions/DashboardPlugin/DataGridPlugin.js';

const { CSVStore, PluginHandler } = Dashboard;

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid);
PluginHandler.addPlugin(DataGridPlugin);

const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();

const dashboard = new Dashboard.Dashboard('container', {
    store: store,
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            store,
            type: 'Highcharts',
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                chart: {
                    animation: false,
                    type: 'column'
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            store
        }]
});