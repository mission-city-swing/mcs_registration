# TODO

### Finishing the necessary features

[x] Profile editing page-- need to be able to add info about the dancer

[x] Search for a dancer page-- need to be able to validate that a person has created a profile

[~] Way to show that a student has passed out of fundamentals - user can make a note that they've passed out of fundamentals
[x] Can view class checkins per student

[x] New student form also checks the student into the class for the day- or maybe add that as an option?-- this is actually what the class selector is for, should just add payment type info ot that

[x] Clean up nav bar - I've made some adjustments in the last few updates, and I'm satisfied with the nav bar for now

### Auth

[x] Current user signs actions with uuid

[~] Current user better displayed-- like in the nav bar
I mean, it's displayed on the home page...

[x] Sign out button-- be careful because unless you auth, you can't write to the test DB -- see nav dropdown


### UI flow

[ ] A "thanks, you've signed in a person!" page, or "Thanks, you've filled out the form!"

[ ] Form validation, errors


### Data organization

[ ] Connect dance events to dance checkin events-- right now they just have the day (date), also, how do we do foreign keys?
