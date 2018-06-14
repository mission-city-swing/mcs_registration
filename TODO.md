# TODO

### Finishing the necessary features

[~] Way to show that a student has passed out of fundamentals - user can make a note that they've passed out of fundamentals

** No, this isn't good enough, need to have a check box or something

[ ] History of classes that the student has attended

[x] Profile editing page-- need to be able to add info about the dancer

[x] Search for a dancer page-- need to be able to validate that a person has created a profile

[x] Can view class checkins per student

[x] New student form also checks the student into the class for the day- or maybe add that as an option?-- this is actually what the class selector is for, should just add payment type info ot that

[x] Clean up nav bar - I've made some adjustments in the last few updates, and I'm satisfied with the nav bar for now

### Auth

[x] Current user signs actions with uuid

[x] Current user better displayed-- like in the nav bar
I mean, it's displayed on the home page...

[x] Sign out button-- be careful because unless you auth, you can't write to the test DB -- see nav dropdown


### UI flow

[ ] Flow oriented towards the student signing themselves in, with the admin checking and receiving payment

[ ] A "Thanks, you've filled out the form!" page

[ ] Form validation

[x] Error handling


### Data organization

[ ] Connect dance events to dance checkin events-- right now they just have the day (date), also, how do we do foreign keys?


### JS tools

[ ] What is flow typing? How does it actually work?
