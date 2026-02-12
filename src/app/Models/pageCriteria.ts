export class PageCriteria {
  pageSize = 10;
  offset = 0;
  
  CurrentPage = 1;
  TotalPages = 0;
  totalrows = 0;
  footerPageHeight = 50;
  pageNumber!: number;
  currentPageRows: number=0;
  headerHeight?: number;
rowHeight?: number | string;

}