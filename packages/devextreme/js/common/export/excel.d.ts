import { DxPromise } from '../../core/utils/deferred';
import { CellRange, ExcelDataGridCell, ExcelExportDataGridProps, ExcelExportPivotGridProps, ExcelPivotGridCell } from '../../excel_exporter_types';

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @static
 * @public
 */
export function exportDataGrid(options: ExcelExportDataGridProps): DxPromise<CellRange>;

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @static
 * @public
 */
export function exportPivotGrid(options: ExcelExportPivotGridProps): DxPromise<CellRange>;


/**
 * @public
 * @namespace DevExpress.excelExporter
 */
export type PivotGridCell = ExcelPivotGridCell;

/**
 * @public
 * @namespace DevExpress.excelExporter
 */
export type DataGridCell = ExcelDataGridCell;
