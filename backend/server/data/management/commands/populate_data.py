from django.core.management.base import BaseCommand

from data.models import Data


class Command(BaseCommand):
    help = 'Populate data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('\n\nPopulating data\n'))

        Data.objects.get_or_create(name="meeting_bail", value="15")
        Data.objects.get_or_create(name="meeting_prepayment", value="15")
        Data.objects.get_or_create(name="free_cancel_hours", value="2")
        Data.objects.get_or_create(name="hair_price", value="25")
        Data.objects.get_or_create(name="beard_price", value="20")
        Data.objects.get_or_create(name="message", value="")
        Data.objects.get_or_create(name="contact_content_second",
                                   value="Jeśli chcesz umówić wizytę, możesz również utworzyć konto i zapisać się w kalendarzu z przedpłatą. Stali klienci mają status zaufanego klienta i nie muszą przedpłacać.")
        Data.objects.get_or_create(
            name="gallery_content", value="Ze zgodą naszych klientów zrobiliśmy im parę zdjęć, byś Ty mógł zdecydować nad swoją przyszła fryzurą")
        Data.objects.get_or_create(name="gallery_title", value="Galeria zdjęć")
        Data.objects.get_or_create(
            name="contact_content", value="Jeśli chcesz dowiedzić się więcej na temat naszego salonu fryzjerskiego lub umówić swoją pierwszą wizytę, możesz zadzwonic na poniższy numer telefonu.")
        Data.objects.get_or_create(name="contact_title", value="Skontaktuj się z nami")
        Data.objects.get_or_create(
            name="home_content", value="Wolność w podejmowaniu decyzji, elastyczność w wykorzystaniu czasu. Przeżyj czas, kiedy dbanie o włosy i brodę było męskie i było częścią bycia mężczyzną")
        Data.objects.get_or_create(name="home_title", value="Męskie strzyżenie & brody")
        Data.objects.get_or_create(name="work_time", value="30")
        Data.objects.get_or_create(name="end_work_sunday", value="")
        Data.objects.get_or_create(name="start_work_sunday", value="")
        Data.objects.get_or_create(name="end_work_saturday", value="22:00")
        Data.objects.get_or_create(name="start_work_saturday", value="10:00")
        Data.objects.get_or_create(name="end_work_friday", value="22:00")
        Data.objects.get_or_create(name="start_work_friday", value="10:00")
        Data.objects.get_or_create(name="end_work_thursday", value="22:00")
        Data.objects.get_or_create(name="start_work_thursday", value="10:00")
        Data.objects.get_or_create(name="end_work_wednesday", value="22:00")
        Data.objects.get_or_create(name="start_work_wednesday", value="10:00")
        Data.objects.get_or_create(name="end_work_tuesday", value="22:00")
        Data.objects.get_or_create(name="start_work_tuesday", value="10:00")
        Data.objects.get_or_create(name="end_work_monday", value="22:00")
        Data.objects.get_or_create(name="start_work_monday", value="10:00")
        Data.objects.get_or_create(name="google_maps_url", value="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d371.25592612718344!2d21.070607758719838!3d51.246661846651435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471843ae043f723d%3A0x822ca4d3514898!2sSALON%20FRYZJERSKI%20DAMIAN%20KWIECIE%C5%83!5e0!3m2!1spl!2spl!4v1617379006232!5m2!1spl!2spl")
        Data.objects.get_or_create(name="location", value="Stefana Żeromskiego 60, 26-680 Wierzbica")
        Data.objects.get_or_create(name="phone_number", value="600 100 100")

        self.stdout.write(self.style.SUCCESS('\Data was populated\n\n'))
