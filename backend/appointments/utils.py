from datetime import datetime, timedelta, date
from .models import DoctorAvailability


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