import { Event, ScheduledTaskJSON } from 'klasa';

export default class extends Event {
  private ensureTask(task: string, time: string) {
    const schedules = this.client.settings?.get('schedules');
    if (!schedules || !schedules.some((s: ScheduledTaskJSON) => s.taskName === task)) {
      this.client.schedule.create(task, time, { catchUp: false });
    }
  }

  async run() {
    this.ensureTask('birthdayUpdate', '0 7 * * *');
  }
}
