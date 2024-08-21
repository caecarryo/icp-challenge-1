import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

interface Attendance {
  id: string;
  employeeName: string;
  date: string;
  status: "present" | "leave" | "sick";
}

@customElement("attendance-app")
export class AttendanceApp extends LitElement {
  @property({ type: Array })
  attendances: Attendance[] = [];

  @property({ type: String })
  employeeName = "";

  @property({ type: String })
  date = "";

  @property({ type: String })
  status: "present" | "leave" | "sick" = "present";

  constructor() {
    super();
    this.getAttendances();
  }

  // Fetch all attendance records
  async getAttendances(): Promise<void> {
    try {
      const response = await fetch("/attendances");
      const data = await response.json();
      this.attendances = data;
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  }

  // Add new attendance record
  async addAttendance(): Promise<void> {
    const newAttendance: Attendance = {
      id: "",
      employeeName: this.employeeName,
      date: this.date,
      status: this.status,
    };

    try {
      const response = await fetch("/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAttendance),
      });

      const data = await response.json();
      this.attendances = [...this.attendances, data];
      this.clearForm();
    } catch (error) {
      console.error("Error adding attendance:", error);
    }
  }

  // Delete an attendance record by ID
  async deleteAttendance(id: string): Promise<void> {
    try {
      await fetch(`/attendance/${id}`, {
        method: "DELETE",
      });

      this.attendances = this.attendances.filter(
        (attendance) => attendance.id !== id
      );
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  }

  // Clear form fields
  clearForm(): void {
    this.employeeName = "";
    this.date = "";
    this.status = "present";
  }

  render(): any {
    return html`
      <h1>Employee Attendance</h1>

      <div>
        <label>Employee Name:</label>
        <input
          type="text"
          .value=${this.employeeName}
          @input=${(e: any) => (this.employeeName = e.target.value)}
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          .value=${this.date}
          @input=${(e: any) => (this.date = e.target.value)}
        />
      </div>

      <div>
        <label>Status:</label>
        <select
          .value=${this.status}
          @change=${(e: any) => (this.status = e.target.value)}
        >
          <option value="present">Present</option>
          <option value="leave">Leave</option>
          <option value="sick">Sick</option>
        </select>
      </div>

      <button @click=${this.addAttendance}>Add Attendance</button>

      <h2>Attendance Records</h2>
      <ul>
        ${this.attendances.map(
          (attendance) => html`
            <li>
              <strong>${attendance.employeeName}</strong> - ${attendance.date}
              (${attendance.status})
              <button @click=${() => this.deleteAttendance(attendance.id)}>
                Delete
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }
}
