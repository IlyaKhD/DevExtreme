import { DataGridCell, PivotGridCell, exportDataGrid, exportPivotGrid } from './common/export/excel';
import { DxPromise } from './core/utils/deferred';

/** @deprecated */
export type ExcelExportDataGridProps = Parameters<typeof exportDataGrid>[0];
/** @deprecated */
export type ExcelExportPivotGridProps = Parameters<typeof exportPivotGrid>[0];
/** @deprecated */
export type ExcelDataGridCell = DataGridCell;
/** @deprecated */
export type ExcelPivotGridCell = PivotGridCell;
/** @deprecated */
export type CellRange = ReturnType<typeof exportDataGrid> extends DxPromise<infer T> ? T : any;
/** @deprecated */
export type CellAddress = Required<CellRange>['from'];
/** @deprecated */
export type ExcelExportBaseProps = Pick<ExcelExportDataGridProps, 'worksheet' | 'topLeftCell' | 'keepColumnWidths' | 'loadPanel' | 'encodeExecutableContent'>;

export {
  /** @deprecated */
  DataGridCell,
  /** @deprecated */
  PivotGridCell,
  /** @deprecated */
  exportDataGrid,
  /** @deprecated */
  exportPivotGrid,
} from './common/export/excel';
