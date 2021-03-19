# PinnedBy App
Zendesk Support App using [React](https://reactjs.org/)  

# Description
- Bookmark tickets in side bar
- View all agents' bookmarked tickets in side bar 
- View all your bookmarked tickets in top bar

# Getting Start
- You need to have a Zendesk internal test account in order to run this project locally.
- Install [zcli](https://github.com/zendesk/zcli) 
- Create a [Ticket Field](https://support.zendesk.com/hc/en-us/articles/203661496-Adding-custom-fields-to-your-tickets-and-support-request-form) called `Pinned by` 

### Running locally

```bash
yarn watch
```
In a second terminal, start the [zcli](https://github.com/zendesk/zcli) server
```bash
yarn start
```

NOTE: You need to add `?zcli_apps=true` to the end of your Zendesk URL to load these apps on your Zendesk account


Pull requests are welcome.

