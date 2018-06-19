# TODO

### Known bugs

[x] On dance checkin, at least one user seems to have a date field, which breaks the datepicker because it's stored as a string-- need to pull date info out of checkin state object so that it's not altered accidentally, and then add it when I send the checkin object to the API call

[x] When entering new data for new dancer, bug introduced when updating the email-- clears other fields

[x] Editing additonal info on class and dance checkin is broken

[ ] Clear warning "Links must not point to '#'. Use a more descriptive href or use a button instead"

[x] Dance and class checkins not saving additional info

### Finishing the necessary features

[ ] Way to show that a student has passed out of fundamentals - need to have a clear check box

[x] History of classes that the student has attended -- class checkins list on student info


### UI flow

#### Flow oriented towards the student signing themselves in, with the admin checking and receiving payment

[x] New student form redirects to class checkin (returning student form)

[x] Dance checkin, when redirected by new student form, should show student data

[x] Dance checkin redirects to a page saying how much the student should pay and asking for confirmation from admin

[x] Admin confirms, hits submit, and then the class checkin is submitted— this should probably be one big full-screen modal

[x] Replicate class checkin flow with modal confirm for dance checkin

[x] Home page should be directions for students and dancers-- new student, class checkin, dance checkin, all flows confirmed by admin at end


#### Other

[ ] Add success/failure to admin sign in

[x] Form validation, especially for new student form— everything should check for name and email, new student form should check for waiver

[ ] Code of conduct and waiver should be in app and need to be signed— need to be included in the app

[ ] Remove "additional info" where possible, or maybe move it to the admin confirm page


### Style

[ ] Logo for nav


### Data organization

[ ] Connect dance events to dance checkin events-- right now they just have the day (date), also, how do we do foreign keys?


### JS tools

[ ] What is flow typing? How does it actually work?
