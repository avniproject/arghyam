import {RuleFactory, VisitScheduleBuilder} from 'rules-config/rules';

const moment = require("moment");
const _ = require("lodash");
const RuleHelper = require('../../RuleHelper');

const WaterQualityEnrolmentBasedVisitsRule = RuleFactory("f6b71fab-0e6f-49ea-b35a-6cb488dc119b", "VisitSchedule");
const WaterQualityTestingBasedVisitsRule = RuleFactory("2477c54f-9106-4af2-8332-9108e4303296", "VisitSchedule");
const WaterQualityTestingCancellationBasedVisitsRule = RuleFactory("609825ea-e8cb-4a78-b28d-3ca63bcf37e1", "VisitSchedule");

const testingPeriodicity = new Map([
    ['January', 'January'],
    ['February', 'April'],
    ['March', 'April'],
    ['April', 'April'],
    ['May', 'August'],
    ['June', 'August'],
    ['July', 'August'],
    ['August', 'August'],
    ['September', 'October'],
    ['October', 'October'],
    ['November', 'January'],
    ['December', 'January']
]);


@WaterQualityEnrolmentBasedVisitsRule("ad14bca2-2c6b-4daf-b774-7dd54632b91e", "Water Quality Enrolment based visit rule", 100.0)
class WaterQualityEnrolmentBasedVisitsRuleArghyam {

    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEnrolment, visitSchedule);
        const currentMonth = moment(programEnrolment.enrolmentDateTime).format("MMMM");
        const monthToSchedule = testingPeriodicity.get(currentMonth);
        const earliestVisitDate = _.isEqual(currentMonth, monthToSchedule) ? moment(programEnrolment.enrolmentDateTime).toDate() : moment().month(monthToSchedule).startOf("month").toDate();
        const visitNameWithSuffix = 'Water quality testing - ' + monthToSchedule;

        const lastDayOfMonth = moment(earliestVisitDate).endOf('month').date();
        const numberOfDaysForMaxOffset = (lastDayOfMonth - moment(earliestVisitDate).date());

        RuleHelper.addSchedule(scheduleBuilder, visitNameWithSuffix, 'Water quality testing',
            earliestVisitDate, numberOfDaysForMaxOffset);

        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@WaterQualityTestingBasedVisitsRule("ab8653d3-1ae5-4cda-96b5-508415270276", "Water quality testing based visit rule", 100.0)
class WaterQualityTestingBasedVisitsRuleArghyam {

    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        const previousEncounterMonth = !_.isNull(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME) ?
            moment(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME).format('MMMM') : moment(programEncounter.encounterDateTime).format("MMMM");
        const distinctMonths = [...new Set(testingPeriodicity.values())];
        const indexOfPreviousVisit = distinctMonths.indexOf(testingPeriodicity.get(previousEncounterMonth));
        const nextVisitMonthIndex = indexOfPreviousVisit === distinctMonths.length - 1 ? 0 : indexOfPreviousVisit + 1;
        const yearOfVisit = indexOfPreviousVisit === distinctMonths.length - 1 ?
            moment(programEncounter.encounterDateTime).year() + 1 : moment(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME).year();
        const monthToSchedule = distinctMonths[nextVisitMonthIndex];
        const earliestVisitDate = _.isEqual(previousEncounterMonth, monthToSchedule) ? moment(programEncounter.encounterDateTime).toDate() : moment().month(monthToSchedule).year(yearOfVisit).startOf("month").toDate();
        const visitNameWithSuffix = 'Water quality testing - ' + monthToSchedule;
        const lastDayOfMonth = moment(earliestVisitDate).endOf('month').date();
        const numberOfDaysForMaxOffset = (lastDayOfMonth - moment(earliestVisitDate).date());
        RuleHelper.addSchedule(scheduleBuilder, visitNameWithSuffix, 'Water quality testing',
            earliestVisitDate, numberOfDaysForMaxOffset);

        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@WaterQualityTestingCancellationBasedVisitsRule("0bab3e21-f058-449b-9b7c-1d60f1bb1bbd", "Water quality testing cancellation based visit rule", 100.0)
class WaterQualityTestingCancellationBasedVisitsRuleArghyam {

    static exec(programEncounter, visitSchedule = [], scheduleConfig) {

        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        const previousEncounterMonth = !_.isNull(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME) ?
            moment(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME).format('MMMM') : moment(programEncounter.cancelDateTime).format("MMMM");
        const distinctMonths = [...new Set(testingPeriodicity.values())];
        const indexOfPreviousVisit = distinctMonths.indexOf(testingPeriodicity.get(previousEncounterMonth));
        const nextVisitMonthIndex = indexOfPreviousVisit === distinctMonths.length - 1 ? 0 : indexOfPreviousVisit + 1;
        const yearOfVisit = indexOfPreviousVisit === distinctMonths.length - 1 ?
            moment(programEncounter.cancelDateTime).year() + 1 : moment(programEncounter.getEncounterDateValues().SCHEDULED_DATE_TIME).year();
        const monthToSchedule = distinctMonths[nextVisitMonthIndex];
        const earliestVisitDate = _.isEqual(previousEncounterMonth, monthToSchedule) ? moment(programEncounter.cancelDateTime).toDate() : moment().month(monthToSchedule).year(yearOfVisit).startOf("month").toDate();
        const visitNameWithSuffix = 'Water quality testing - ' + monthToSchedule;
        const lastDayOfMonth = moment(earliestVisitDate).endOf('month').date();
        const numberOfDaysForMaxOffset = (lastDayOfMonth - moment(earliestVisitDate).date());
        RuleHelper.addSchedule(scheduleBuilder, visitNameWithSuffix, 'Water quality testing',
            earliestVisitDate, numberOfDaysForMaxOffset);

        return scheduleBuilder.getAllUnique("encounterType");
    }
}

module.exports = {
    WaterQualityEnrolmentBasedVisitsRuleArghyam,
    WaterQualityTestingBasedVisitsRuleArghyam,
    WaterQualityTestingCancellationBasedVisitsRuleArghyam
};
