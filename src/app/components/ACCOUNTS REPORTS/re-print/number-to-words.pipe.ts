import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return '';
    return this.convertToWords(num);
  }

  private convertToWords(num: number): string {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    let words = '';
    let i = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        words = this.helper(num % 1000, ones, teens, tens) + ' ' + thousands[i] + ' ' + words;
      }
      num = Math.floor(num / 1000);
      i++;
    }

    return words.trim();
  }

  private helper(num: number, ones: string[], teens: string[], tens: string[]): string {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
    return ones[Math.floor(num / 100)] + ' Hundred ' + this.helper(num % 100, ones, teens, tens);
  }

}
