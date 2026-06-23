from datetime import datetime, timedelta, date
from .models import Appointment, DoctorAvailability
from users.models import User


def generate_doctor_schedule(doctor, days=30):

    start_morning = datetime.strptime(
        "08:00",
        "%H:%M"
    )

    end_morning = datetime.strptime(
        "12:00",
        "%H:%M"
    )


    start_afternoon = datetime.strptime(
        "14:00",
        "%H:%M"
    )

    end_afternoon = datetime.strptime(
        "18:00",
        "%H:%M"
    )


    for day in range(days):

        current_date = date.today() + timedelta(days=day)


        # mañana
        current = start_morning

        while current < end_morning:

            DoctorAvailability.objects.get_or_create(
                doctor=doctor,
                date=current_date,
                time=current.time()
            )

            current += timedelta(minutes=30)



        # tarde
        current = start_afternoon

        while current < end_afternoon:

            DoctorAvailability.objects.get_or_create(
                doctor=doctor,
                date=current_date,
                time=current.time()
            )

            current += timedelta(minutes=30)

#AGENDA DINAMICA

def clean_old_data():

    # cancelar citas pendientes vencidas

    Appointment.objects.filter(
        appointment_date__lt=date.today(),
        status='pending'
    ).update(
        status='cancelled'
    )

    # eliminar disponibilidades viejas

    DoctorAvailability.objects.filter(
        date__lt=date.today()
    ).delete()

def ensure_schedule_for_all_doctors():

    doctors = User.objects.filter(
        role='doctor',
        is_active=True
    )

    for doctor in doctors:

        generate_doctor_schedule(
            doctor,
            days=30
        )

def maintain_system():

    clean_old_data()

    ensure_schedule_for_all_doctors()