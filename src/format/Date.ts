// Left-pad for a more pleasing presentation.
function augmenter<T>(num): T {
    return num < 10 ? '0' + num : num;
};

const oldGetMonth = Date.prototype.getMonth;
const oldGetDate = Date.prototype.getDate;
const oldGetHours = Date.prototype.getHours;
const oldGetMinutes = Date.prototype.getMinutes;
const oldGetSeconds = Date.prototype.getSeconds;

Date.prototype.getMonth = function () {
    // #getMonth is zero-based.
    return augmenter<number>(oldGetMonth.call(this) + 1);
};

Date.prototype.getDate = function () {
    return augmenter<number>(oldGetDate.call(this));
};

Date.prototype.getHours = function () {
    return augmenter<number>(oldGetHours.call(this));
};

Date.prototype.getMinutes = function () {
    return augmenter<number>(oldGetMinutes.call(this));
};

Date.prototype.getSeconds = function () {
    return augmenter<number>(oldGetSeconds.call(this));
};

import Base from './Base';

export default class DateFormatter extends Base {
    private displayDateTpl: string = '[{getDateString} {getTimeString}]';
    private dateTpl: string = '{Y}-{m}-{d}';
    private timeTpl: string = '{H}:{i}:{s}.{ms}';
    private tokenRe = /{([a-zA-Z]+)}/g;

    private tpls = {
        getDateString: this.formatDateString<string>(this.dateTpl),
        getTimeString: this.formatDateString<string>(this.timeTpl)
    };

    private dateObjectMethods = {
        d: 'getDate',
        H: 'getHours',
        i: 'getMinutes',
        m: 'getMonth',
        s: 'getSeconds',
        ms: 'getMilliseconds',
        Y: 'getFullYear'
    };

    // Will call methods on JavaScript's Date object.
    private formatDateString<T>(tpl: string) {
        return (d) => tpl.replace(this.tokenRe, (a, $1) => d[this.dateObjectMethods[$1]]());
    }

    // Glues the sub-templates together.
    private getDisplayDateString() {
        return this.displayDateTpl.replace(this.tokenRe, (a, $1) => this.tpls[$1](new Date()));
    }

    public prelog(logMethodName: string): string {
        return `${this.getDisplayDateString()} [${logMethodName.toUpperCase()}]`;
    }

    public setDateTpl(tpl: string): void {
        this.tpls.getDateString = this.formatDateString(tpl);
    }

    public setTimeTp(tpl: string): void {
        this.tpls.getTimeString = this.formatDateString(tpl);
    }
}

