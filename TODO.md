# TODO

### Finishing the necessary features

[ ] Way to show that a student has passed out of fundamentals - need to have a clear check box

[ ] History of classes that the student has attended


### UI flow

#### Flow oriented towards the student signing themselves in, with the admin checking and receiving payment

[x] New student form redirects to class checkin (returning student form)

[x] Dance checkin, when redirected by new student form, should show student data

[x] Dance checkin redirects to a page saying how much the student should pay and asking for confirmation from admin

[x] Admin confirms, hits submit, and then the class checkin is submitted— this should probably be one big full-screen modal

[ ] Replicate class checkin flow with modal confirm for dance checkin

[ ] Home page should be directions for students and dancers-- new student, class checkin, dance checkin, all flows confirmed by admin at end


#### Other

[ ] Form validation, especially for new student form— everything should check for name and email, new student form should check for waiver

[ ] Code of conduct and waiver should be in app and need to be signed— need to be included in the app

[ ] Remove "additional info" where possible, or maybe move it to the admin confirm page


### Style

[ ] Logo for nav


### Data organization

[ ] Connect dance events to dance checkin events-- right now they just have the day (date), also, how do we do foreign keys?


### JS tools

[ ] What is flow typing? How does it actually work?
