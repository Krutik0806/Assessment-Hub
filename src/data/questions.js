// =============================================
//  ServiceNow CSA – Question Bank
//  Each question: { id, question, options, answer: [indexes], explanation, multi }
//  answer indexes are 0-based (A=0, B=1, C=2, D=3, E=4, F=5)
// =============================================

export const TESTS = {
    1: {
        name: "Practice Test 1",
        total: 60,
        questions: [
            {
                id: 1,
                question: "Create Incident, Password Reset, and Report outage: what do these services in the Service Catalog have in common?",
                options: [
                    "They direct the user to a record producer",
                    "They direct the user to a catalog property",
                    "They direct the user to a catalog UI policy",
                    "They direct the user to a catalog client script"
                ],
                answer: [0],
                explanation: "These catalog items use Record Producers to generate records (like Incident). A record producer is a form used in the Service Catalog to create task-based records while collecting necessary information from users.",
                multi: false
            },
            {
                id: 2,
                question: "On a Form header, what is the three bar icon called?",
                options: [
                    "Pancake icon",
                    "Hamburger icon",
                    "Cake icon",
                    "Form Context Menu"
                ],
                answer: [3],
                explanation: "In ServiceNow, the three-line icon in a form header opens the Form Context Menu, which contains options like Configure, Export, View, etc.",
                multi: false
            },
            {
                id: 3,
                question: "What do you need to do before you can use an Application-based trigger in your flow?",
                options: [
                    "Activate application trigger spoke",
                    "Activate application plugins only",
                    "Activate trigger security rules",
                    "Activate application spoke, and plug-ins as needed",
                    "Assign Application trigger role [sn_app_trigger_write] to SME"
                ],
                answer: [3],
                explanation: "Application-based triggers rely on spokes and required plug-ins. Without activating them, the trigger will not be available in Flow Designer.",
                multi: false
            },
            {
                id: 4,
                question: "Your customer requires the ability to monitor which users are performing impersonations in their instance. What would you do to meet that requirement?",
                options: [
                    "From User icon, select Elevate Roles",
                    "On the Impersonator role record, right click and select Create Log",
                    "Activate the glide.sys.log_impersonation prop",
                    "Add the role Log Write [sn_log_write] to the Impersonator Group",
                    "Create user update set for impersonation tracking"
                ],
                answer: [2],
                explanation: "Setting the system property glide.sys.log_impersonation to true enables logging of impersonation activities.",
                multi: false
            },
            {
                id: 5,
                question: "A knowledge article must be which of the following states to display to a user?",
                options: [
                    "Published",
                    "Review",
                    "Draft",
                    "Retired"
                ],
                answer: [0],
                explanation: "Only articles in the Published state are visible to end users.",
                multi: false
            },
            {
                id: 6,
                question: "Which one of the following is an accurate list of changes that are captured in an Update Set?",
                options: [
                    "Changes made to: tables, forms, scheduled jobs, and client scripts",
                    "Changes made to: tables, forms, groups, and configuration items (CIs)",
                    "Changes made to: table, forms, views, and fields",
                    "Changes made to: tables, forms, Business Rules, and data records"
                ],
                answer: [2],
                explanation: "Update Sets capture configuration changes (metadata), not actual data like groups or CI records.",
                multi: false
            },
            {
                id: 7,
                question: "Which of the following protects applications by identifying and restricting access to available files and data?",
                options: [
                    "Application Scope",
                    "Application Configuration",
                    "Access Control Rules",
                    "Verbose Log"
                ],
                answer: [0],
                explanation: "Application Scope restricts cross-application access to tables, scripts, and other resources.",
                multi: false
            },
            {
                id: 8,
                question: "An IT manager is responsible for the Network and Hardware assignment groups, each group contains 5 team members. These team members are working on many tasks, but the manager cannot see any tasks on the Service Desk > My Groups Work list. What could explain this?",
                options: [
                    "The Service Desk > My Groups Work list shows active work tasks that are not yet assigned",
                    "The manager is not a member of the Service Desk group",
                    "The manager does not have the itil role",
                    "The manager is not a member of the Network and Hardware groups"
                ],
                answer: [3],
                explanation: "\"My Groups Work\" shows tasks assigned to groups where the user is a member. If the manager is not a member of those groups, they won't see those tasks.",
                multi: false
            },
            {
                id: 9,
                question: "Which application is used primarily to load data into ServiceNow?",
                options: [
                    "Import Set",
                    "System Import Sets",
                    "Import Management",
                    "Import Hub"
                ],
                answer: [1],
                explanation: "The System Import Sets application loads external data into staging tables for transformation.",
                multi: false
            },
            {
                id: 10,
                question: "What options are available to choose from in the 'When' field in the Business Rule? (Select 2 answers)",
                options: [
                    "Insert",
                    "Update",
                    "Before",
                    "After"
                ],
                answer: [2, 3],
                explanation: "The \"When\" field determines execution timing: Before, After, Async, or Display. Insert and Update are conditions (\"When\" actions), not timing options.",
                multi: true
            },
            {
                id: 11,
                question: "A new employee joins the IT department and needs to perform work assigned to Network and Hardware groups. What would you do? (Select 3 answers)",
                options: [
                    "Modify ACL",
                    "Add roles to the user",
                    "Add User Account to Hardware group",
                    "Create User Account",
                    "Add User Account to Software group",
                    "Add User Account to Network group"
                ],
                answer: [2, 3, 5],
                explanation: "To work on group tasks, the user must exist and be added to the appropriate assignment groups: Create User Account, then add to Hardware and Network groups.",
                multi: true
            },
            {
                id: 12,
                question: "When using the Load Data and Transform Map process, what is the Mapping Assist used for?",
                options: [
                    "Mapping fields using the Import Log",
                    "Mapping fields using an SLA",
                    "Mapping fields using Transform History",
                    "Mapping fields using a Field Map"
                ],
                answer: [3],
                explanation: "Mapping Assist helps create field mappings between source and target tables using a Field Map.",
                multi: false
            },
            {
                id: 13,
                question: "Which tool should be used to populate commonly used fields in a form?",
                options: [
                    "Template",
                    "Reference Qualifier",
                    "Formatter",
                    "Assignment Rule"
                ],
                answer: [0],
                explanation: "Templates pre-populate fields with predefined values, saving time on repetitive data entry.",
                multi: false
            },
            {
                id: 14,
                question: "What is the Import Set Table?",
                options: [
                    "A table where data will be placed, post-transformation",
                    "A repository for Update Set information",
                    "A table that determines relationships",
                    "A staging area for imported records"
                ],
                answer: [3],
                explanation: "Import Set tables temporarily hold imported data before transformation to the target table.",
                multi: false
            },
            {
                id: 15,
                question: "Which term best describes something that is created, has work performed upon it, and is eventually moved to a state of closed?",
                options: [
                    "report",
                    "flow",
                    "task",
                    "event"
                ],
                answer: [2],
                explanation: "A Task (incident, problem, change request) follows lifecycle states from creation through work to a closed state.",
                multi: false
            },
            {
                id: 16,
                question: "Which one of the following statements describes the purpose of a Service Catalog flow?",
                options: [
                    "A Service Catalog flow generates three basic components: item variable types, tasks, and notifications",
                    "A Service Catalog flow generates three basic components: item variable types, tasks, and approvals",
                    "A Service Catalog flow is used to drive complex fulfillment processes and sends notifications to defined users or groups",
                    "Although a Service Catalog flow cannot send notifications, the flow drives complex fulfillment processes"
                ],
                answer: [2],
                explanation: "Catalog flows automate fulfillment steps like approvals, tasks, and notifications to defined users or groups.",
                multi: false
            },
            {
                id: 17,
                question: "IntegrationHub enables execution of third-party APIs as a part of a flow. These integrations are referred to as",
                options: [
                    "a spoke",
                    "an action",
                    "an integration step",
                    "a connection"
                ],
                answer: [0],
                explanation: "IntegrationHub uses Spokes to integrate with third-party systems like Slack, Jira, ServiceNow, etc.",
                multi: false
            },
            {
                id: 18,
                question: "What are examples of Core tables in the ServiceNow platform?",
                options: [
                    "Team, Party, Awards",
                    "User, Task, Incident",
                    "Configuration, Connect, Chat",
                    "Work, Caller, Timecard"
                ],
                answer: [1],
                explanation: "User [sys_user], Task [task], and Incident [incident] are foundational core tables in the ServiceNow platform.",
                multi: false
            },
            {
                id: 19,
                question: "Which role can manage multiple knowledge bases?",
                options: [
                    "sn_kb_admin",
                    "knowledge_admin",
                    "kb_admin",
                    "knowledge_base_admin"
                ],
                answer: [1],
                explanation: "The knowledge_admin role provides the ability to manage all knowledge bases and their articles.",
                multi: false
            },
            {
                id: 20,
                question: "What is the primary application used to load data into ServiceNow?",
                options: [
                    "Configuration",
                    "Service Level Management",
                    "System Import Sets",
                    "System Update Sets"
                ],
                answer: [2],
                explanation: "System Import Sets handles data imports from external sources and provides transformation capabilities.",
                multi: false
            },
            // ── Q21–Q40 ──
            {
                id: 21,
                question: "What is a key difference between Reporting and Performance Analytics?",
                options: [
                    "Performance Analytics data can be published to Dashboards; Reports cannot.",
                    "Reports can be run on a scheduled basis; Performance Analytics cannot.",
                    "Performance Analytics shows KPIs; Reporting does not.",
                    "Performance Analytics contains snapshots of data taken over time; Reporting shows only the data as it is, at the moment the report is run."
                ],
                answer: [3],
                explanation: "Performance Analytics stores historical snapshots to analyze trends. Standard reports show real-time data only.",
                multi: false
            },
            {
                id: 22,
                question: "What is a key difference between Reporting and Performance Analytics? (variant)",
                options: [
                    "Performance Analytics contains snapshots of data taken over time; Reporting shows only the data as it is, at the moment the report is run.",
                    "Performance Analytics can show trends; Reports cannot.",
                    "Performance Analytics shows KPIs; Reporting does not.",
                    "Performance Analytics data can be published to Dashboards; Reports cannot.",
                    "Reports can be run on a scheduled basis; Performance Analytics cannot."
                ],
                answer: [0],
                explanation: "Again emphasizes historical trend tracking vs real-time reporting.",
                multi: false
            },
            {
                id: 23,
                question: "Which of the following is used to categorize, flag, and locate records?",
                options: [
                    "Search",
                    "Favorites",
                    "Tags",
                    "Bookmarks"
                ],
                answer: [2],
                explanation: "Tags allow users to categorize and easily retrieve records later.",
                multi: false
            },
            {
                id: 24,
                question: "What is the name of the conversational bot platform that provides assistance to help users obtain information, make decisions, and perform common tasks?",
                options: [
                    "Connect Chat",
                    "Live Feed",
                    "Virtual Agent",
                    "Answer Agent"
                ],
                answer: [2],
                explanation: "Virtual Agent is ServiceNow's chatbot platform for conversational self-service.",
                multi: false
            },
            {
                id: 25,
                question: "Where can the user find notes for their incidents?",
                options: [
                    "Comments section",
                    "Notes section",
                    "Notes field",
                    "Description field"
                ],
                answer: [1],
                explanation: "Notes are stored in the Notes related section on the incident form, not in the description field.",
                multi: false
            },
            {
                id: 26,
                question: "How to combine data from two tables in a report?",
                options: [
                    "Join",
                    "Related Lists",
                    "Many to Many",
                    "Database View"
                ],
                answer: [3],
                explanation: "Database Views allow reporting across multiple tables by combining them into a single virtual table.",
                multi: false
            },
            {
                id: 27,
                question: "What is a characteristic of importing data into ServiceNow?",
                options: [
                    "An existing Transform Map can be used one time on the same import set",
                    "Coalesce fields are used only after running Transform",
                    "Any user can manage and set up import sets",
                    "An existing Transform Map can be used multiple times on the same import set"
                ],
                answer: [3],
                explanation: "Transform Maps can be reused to reprocess the same import set multiple times.",
                multi: false
            },
            {
                id: 28,
                question: "Look at the image below. What is being displayed?",
                image: "images/q28.png",
                options: [
                    "Schema map",
                    "CI Dependency View",
                    "CI Class Manager",
                    "Relationships"
                ],
                answer: [1],
                explanation: "CI Dependency View graphically displays relationships between Configuration Items in the CMDB. The image shows a Windows Server (ip-172-31-40-200) at the top, with connected child CIs such as Virtual Machine Instance, Network Adapter, Disk, and Tracked Configurations.",
                multi: false
            },
            {
                id: 29,
                question: "The manager plans to send the same report every month to the client via email. What can help with this?",
                options: [
                    "Scheduled Report",
                    "Date/Time field on the report record",
                    "Scheduled Job",
                    "Schedule"
                ],
                answer: [0],
                explanation: "Scheduled Reports automatically email reports at defined intervals (daily, weekly, monthly, etc.).",
                multi: false
            },
            {
                id: 30,
                question: "Which are valid ServiceNow User Authentication Methods? (Select 3 answers)",
                options: [
                    "FTP authentication",
                    "LDAP",
                    "SSO",
                    "Local Database",
                    "XML feed"
                ],
                answer: [1, 2, 3],
                explanation: "ServiceNow supports LDAP (directory sync), SSO (Single Sign-On), and internal Local Database authentication.",
                multi: true
            },
            {
                id: 31,
                question: "The user has asked you to set up a completely new process. What will you use?",
                options: [
                    "Workflow",
                    "Flow",
                    "Business Rule",
                    "UI Policy"
                ],
                answer: [1],
                explanation: "Flow Designer is the modern, no-code/low-code tool for creating new automated processes in ServiceNow.",
                multi: false
            },
            {
                id: 32,
                question: "What are examples of UI Actions relating to forms? (Select 3 answers)",
                options: [
                    "Form Buttons",
                    "Form View",
                    "Form Links",
                    "Form Context Menu",
                    "Form Columns"
                ],
                answer: [0, 2, 3],
                explanation: "Form Buttons, Form Links, and Form Context Menu are all UI Action elements that appear on forms.",
                multi: true
            },
            {
                id: 33,
                question: "Knowledge Base Search results can be sorted by which of the following? (Select 3 answers)",
                options: [
                    "Relevance",
                    "My group articles",
                    "Newest",
                    "Popularity",
                    "Views"
                ],
                answer: [0, 2, 4],
                explanation: "Knowledge search results can be sorted by Relevance, Newest, and Views in the ServiceNow Knowledge Base.",
                multi: true
            },
            {
                id: 34,
                question: "Which database provides a logical model of your company infrastructure by identifying, controlling, maintaining and verifying CIs that exist?",
                options: [
                    "CIBM",
                    "CSDM",
                    "ITSM",
                    "LDAP",
                    "CMDB"
                ],
                answer: [4],
                explanation: "The Configuration Management Database (CMDB) stores and manages Configuration Items and their relationships.",
                multi: false
            },
            {
                id: 35,
                question: "A customer wants to use a client script to validate things on a form before submission. What type of client script would you recommend?",
                options: [
                    "onSubmit()",
                    "onLoad()",
                    "onSubmission()",
                    "onUpdate()"
                ],
                answer: [0],
                explanation: "onSubmit() runs before the form is submitted to the server and is the correct type for pre-submission validation.",
                multi: false
            },
            {
                id: 36,
                question: "What module in the Service Catalog application does an Administrator access to begin creating a new catalog item?",
                options: [
                    "Catalog Item",
                    "Maintain Items",
                    "Content Items",
                    "Items"
                ],
                answer: [1],
                explanation: "Catalog Items are created and managed under the Maintain Items module in the Service Catalog application.",
                multi: false
            },
            {
                id: 37,
                question: "Which statement correctly describes the differences between a Client Script and a Business Rule?",
                options: [
                    "A Client Script executes on the server and a Business Rule executes on the client",
                    "A Client Script executes before a record is loaded and a Business Rule executes after a record is updated",
                    "A Client Script executes before a record is loaded and a Business Rule executes after a record is loaded",
                    "A Client Script executes on the client and a Business Rule executes on the server"
                ],
                answer: [3],
                explanation: "Client Scripts run in the user's browser (client-side); Business Rules run on the ServiceNow server (server-side).",
                multi: false
            },
            {
                id: 38,
                question: "How can the abbreviation CSDM be expanded?",
                options: [
                    "Common Service Data Model",
                    "Common System Database Model",
                    "Customer Service Data Model",
                    "Customer System Data Media"
                ],
                answer: [0],
                explanation: "CSDM stands for Common Service Data Model — a framework for how to model and connect data in ServiceNow.",
                multi: false
            },
            {
                id: 39,
                question: "The ServiceNow platform includes which types of interfaces? (Select 3 answers)",
                options: [
                    "Field Service Taskboard",
                    "Back Office Dashboard",
                    "Service Portals",
                    "Now Mobile Apps",
                    "Agent Control Center",
                    "Now Platform® User Interfaces"
                ],
                answer: [2, 3, 5],
                explanation: "ServiceNow supports Service Portals, Now Mobile Apps, and the Now Platform® User Interface as primary interface types.",
                multi: true
            },
            {
                id: 40,
                question: "What sections do you need to fill in when creating a notification? (Select 3 answers)",
                options: [
                    "Notes",
                    "What it will contain",
                    "Who will receive",
                    "When to send",
                    "Who will send"
                ],
                answer: [1, 2, 3],
                explanation: "A ServiceNow notification requires three sections: Who will receive (recipients), When to send (trigger condition), and What it will contain (message content).",
                multi: true
            },
            // ── Q41–Q60 ──
            {
                id: 41,
                question: "Which one of the following describes the primary operations performed against tables in the ServiceNow platform?",
                options: [
                    "Create, Rate, Update, Delete",
                    "Create, Read, Write, Delete",
                    "Create, Read, Upload, Delete",
                    "Capture, Rate, Write, Develop"
                ],
                answer: [1],
                explanation: "These are standard CRUD operations used for interacting with database tables in ServiceNow.",
                multi: false
            },
            {
                id: 42,
                question: "What action will allow you to personalize layouts of columns in a list?",
                options: [
                    "Context Menu > View > Personalize",
                    "Click Gear Icon > Personalize window options > Select the appropriate columns",
                    "Select the column > Click Edit icon > Choose options",
                    "Right-click header > Choose options"
                ],
                answer: [1],
                explanation: "The gear icon in the list header allows users to personalize which columns are shown.",
                multi: false
            },
            {
                id: 43,
                question: "Which tab on the knowledge base record would you use to identify the sets of users who are able to read articles in that knowledge base?",
                options: [
                    "Can Read",
                    "Can Access",
                    "ACL",
                    "Accessible to"
                ],
                answer: [0],
                explanation: "The 'Can Read' tab on the knowledge base record controls which roles or groups can read knowledge articles.",
                multi: false
            },
            {
                id: 44,
                question: "Where can you create a flow?",
                options: [
                    "Process Automation > Flow Designer",
                    "Process Automation > Create Flow",
                    "Workflow > Flow Designer",
                    "Workflow > Workflow Editor"
                ],
                answer: [0],
                explanation: "Flows are created in Flow Designer, accessed via Process Automation > Flow Designer.",
                multi: false
            },
            {
                id: 45,
                question: "How are Workflows moved between instances?",
                options: [
                    "Workflows are moved using Update Sets",
                    "Workflows are moved using XML only",
                    "Workflows cannot be moved",
                    "Workflows are moved using Application Sets"
                ],
                answer: [0],
                explanation: "Update Sets capture workflow configuration changes and are used to move them between instances.",
                multi: false
            },
            {
                id: 46,
                question: "While showing a customer their Incident form, they ask to change the Priority field title to display their internal terminology. How would you do that? (Select 2 answers)",
                options: [
                    "Right click Priority > Configure Column",
                    "Right click Priority > Configure Display Settings",
                    "Right click Priority > Configure Dictionary",
                    "Right click Priority > Configure Label"
                ],
                answer: [2, 3],
                explanation: "Dictionary controls field properties (type, attributes), and Label changes the display text shown on forms. Both can be used to change how the field appears.",
                multi: true
            },
            {
                id: 47,
                question: "Which admin role is required to make changes to High Security Settings?",
                options: [
                    "acl_admin",
                    "admin",
                    "security_admin",
                    "sec_admin",
                    "hi_sec_admin"
                ],
                answer: [2],
                explanation: "High Security Settings require the elevated security_admin role to modify.",
                multi: false
            },
            {
                id: 48,
                question: "What records can be created when placing an order in the Service Catalog? (Select 3 answers)",
                options: [
                    "Request [sc_request]",
                    "Problem Task [problem_task]",
                    "Change Request [change_request]",
                    "Requested Item [sc_req_item]",
                    "Catalog Task [sc_task]"
                ],
                answer: [0, 3, 4],
                explanation: "A Service Catalog order creates a REQ (Request) → RITM (Requested Item) → SCTASK (Catalog Task) hierarchy.",
                multi: true
            },
            {
                id: 49,
                question: "What information does the System Dictionary contain?",
                options: [
                    "The definition for each table and column",
                    "The human-readable labels and language settings",
                    "The information on how tables relate",
                    "The language dictionary for spell checking"
                ],
                answer: [0],
                explanation: "The System Dictionary defines all fields, their data types, and attributes for every table in ServiceNow.",
                multi: false
            },
            {
                id: 50,
                question: "What is the name of the 32-character unique key assigned to every record?",
                options: [
                    "ID",
                    "Sys ID",
                    "Key",
                    "Unique ID",
                    "System ID"
                ],
                answer: [1],
                explanation: "Every ServiceNow record is assigned a globally unique 32-character Sys ID (sys_id).",
                multi: false
            },
            {
                id: 51,
                question: "What ServiceNow feature allows you to include data from a secondary related table on a report?",
                options: [
                    "Outer Join",
                    "Join",
                    "Dot Walking",
                    "SQL"
                ],
                answer: [2],
                explanation: "Dot walking traverses table relationships (e.g., incident.caller_id.department) to retrieve fields from related tables in reports and scripts.",
                multi: false
            },
            {
                id: 52,
                question: "What do you activate when you want to add applications or functionality within your development instance?",
                options: [
                    "Update Set",
                    "App Package",
                    "Updated Pack",
                    "Patch",
                    "Plugin"
                ],
                answer: [4],
                explanation: "Plugins are activated to enable additional applications and functionality within a ServiceNow instance.",
                multi: false
            },
            {
                id: 53,
                question: "What are the components that make up a filter condition? (Select 3 answers)",
                options: [
                    "Field",
                    "Value",
                    "Column",
                    "Operator",
                    "Match Criteria"
                ],
                answer: [0, 1, 3],
                explanation: "A filter condition in ServiceNow is composed of: Field + Operator + Value (e.g., Priority = High).",
                multi: true
            },
            {
                id: 54,
                question: "What process allows users to create, categorize, review, approve and browse important information in a centralized location shared by the entire organization?",
                options: [
                    "Knowledge-Centered Management",
                    "Knowledge Management",
                    "Information Portal Management",
                    "Self Service Management",
                    "Business Information Management"
                ],
                answer: [1],
                explanation: "Knowledge Management handles the full lifecycle of knowledge articles, from creation through review, approval, publishing, and retirement.",
                multi: false
            },
            {
                id: 55,
                question: "What controls the publishing and retiring process for knowledge articles?",
                options: [
                    "Approval Definitions",
                    "Workflow",
                    "Approval Policies",
                    "State Lifecycle",
                    "Workflow Designer"
                ],
                answer: [1],
                explanation: "Knowledge workflows control the approval, publishing, and retiring states of knowledge articles.",
                multi: false
            },
            {
                id: 56,
                question: "Which three Variable Types can be added to a Service Catalog Item?",
                options: [
                    "True/False, Checkbox, and Number List",
                    "Number List, Single Line Text, and Reference",
                    "True/False, Multiple Choice, and Ordered",
                    "Multiple Choice, Select Box, and Checkbox"
                ],
                answer: [3],
                explanation: "Multiple Choice, Select Box, and Checkbox are valid Service Catalog variable types available when building catalog items.",
                multi: false
            },
            {
                id: 57,
                question: "How is a group defined in ServiceNow?",
                options: [
                    "A group defines users sharing location",
                    "A group defines users sharing job title",
                    "A group is stored in sys_user_group_type",
                    "A group is one record stored in the Group [sys_user_group] table"
                ],
                answer: [3],
                explanation: "In ServiceNow, a group is a single record stored in the sys_user_group table, used for assignment and access control.",
                multi: false
            },
            {
                id: 58,
                question: "What will happen if you click 'Filter Out' on the 'Hardware' category on the incident list?",
                options: [
                    "Opens new window",
                    "Nothing happens",
                    "Hardware incidents remain visible",
                    "All incidents with Hardware category will disappear"
                ],
                answer: [3],
                explanation: "'Filter Out' adds a condition to exclude those records, so all Hardware incidents will be removed from the current list view.",
                multi: false
            },
            {
                id: 59,
                question: "What ServiceNow API will you use to retrieve incident data in a server script?",
                options: [
                    "GlideApi",
                    "GlideData",
                    "GlideRecord",
                    "g_form"
                ],
                answer: [2],
                explanation: "GlideRecord is the server-side API used to query, create, update, and delete records in ServiceNow database tables.",
                multi: false
            },
            {
                id: 60,
                question: "Which of the following is true of Service Catalog Items in relation to the Service Catalog?",
                options: [
                    "They run behind the scenes",
                    "They are optional",
                    "They are the building blocks",
                    "They provide options"
                ],
                answer: [2],
                explanation: "Service Catalog Items are the core building blocks of the Service Catalog — they define what users can request.",
                multi: false
            }
        ]
    },
    2: {
        name: "Practice Test 2",
        total: 60,
        questions: [
            {
                id: 1,
                question: "Which of the following is used to initiate a flow?",
                options: ["A spoke", "An Event", "A Trigger", "Core Action"],
                answer: [2],
                explanation: "A Flow in Flow Designer always begins with a Trigger. The trigger defines when and how the flow starts (record created, updated, scheduled, etc.).",
                multi: false
            },
            {
                id: 2,
                question: "What is the name of the table relationship where two or more tables are related in a bi-directional relationship so that related records are visible from both tables in a related list?",
                options: ["One to Many", "Database View", "Many to Many", "Extended"],
                answer: [2],
                explanation: "A Many-to-Many (M2M) relationship allows records from both tables to reference each other via a junction table.",
                multi: false
            },
            {
                id: 3,
                question: "Which features allow you to update multiple records at one time? (Select 2 answers)",
                options: ["Bulk Record Update", "Data Remediation Dashboard", "Field Update Action", "List Editor", "Update Selected Action"],
                answer: [3, 4],
                explanation: "List Editor allows inline editing of multiple records. Update Selected lets you modify multiple selected records at once.",
                multi: true
            },
            {
                id: 4,
                question: "Which statement describes the contents of the CMDB?",
                options: [
                    "CMDB contains Business Rules",
                    "CMDB contains data about tangible and intangible business assets",
                    "CMDB contains ITIL process data",
                    "CMDB archives Service Management PaaS metadata"
                ],
                answer: [1],
                explanation: "CMDB stores configuration items (CIs) and their relationships — hardware, software, services, and other business assets.",
                multi: false
            },
            {
                id: 5,
                question: "The ______ protects applications by identifying and restricting access to available files and data.",
                options: ["Application Scope", "Update Set", "Application Configuration", "Access Control Rule"],
                answer: [0],
                explanation: "Application Scope isolates application files and data, protecting them from unauthorized access by other apps.",
                multi: false
            },
            {
                id: 6,
                question: "In what case will you use workflow and NOT flow?",
                options: ["Low-code automation", "SLA timer is required", "Reusable actions across flows", "New logic development"],
                answer: [1],
                explanation: "Legacy Workflow supports SLA timers in specific use cases where Flow Designer may not natively handle them.",
                multi: false
            },
            {
                id: 7,
                question: "Which field is used as a unique key during imports?",
                options: ["Sys IDs", "Coalesce Fields", "Key Fields", "Match Fields"],
                answer: [1],
                explanation: "Coalesce fields determine whether to update existing records or insert new ones during an import transformation.",
                multi: false
            },
            {
                id: 8,
                question: "Other than Update Set, how else can you move data to another instance in an easy way?",
                options: ["XML", "REST", "CSV", "Excel"],
                answer: [0],
                explanation: "Records can be exported as XML and imported into another ServiceNow instance directly.",
                multi: false
            },
            {
                id: 9,
                question: "How many knowledge bases can a knowledge article be associated with?",
                options: ["Cannot associate", "Only one", "Multiple"],
                answer: [1],
                explanation: "A knowledge article belongs to exactly one Knowledge Base at a time.",
                multi: false
            },
            {
                id: 10,
                question: "Buttons, form links, and context menu items are examples of what type of functionality?",
                options: ["Business Rule", "UI Actions", "Client Script", "UI Policy"],
                answer: [1],
                explanation: "UI Actions create buttons, links, and context menu actions that appear on forms and lists.",
                multi: false
            },
            {
                id: 11,
                question: "Which allows a user to edit field values in a list without opening the form?",
                options: ["List editor", "UI Action", "Data Editor", "Update flow"],
                answer: [0],
                explanation: "List Editor enables inline editing of field values directly within the list view, without opening the individual record form.",
                multi: false
            },
            {
                id: 12,
                question: "What do you click to see report results without saving?",
                options: ["Test", "Run", "Try It", "Execute", "Save"],
                answer: [1],
                explanation: "The Run button executes and previews the report without saving any changes to the report definition.",
                multi: false
            },
            {
                id: 13,
                question: "How do you define sys_id in ServiceNow?",
                options: [
                    "Unique 30-character identifier",
                    "Unique 34-character identifier",
                    "Unique 20-character identifier",
                    "Unique 32-character identifier"
                ],
                answer: [3],
                explanation: "Every ServiceNow record has a globally unique 32-character sys_id that identifies the record across all tables.",
                multi: false
            },
            {
                id: 14,
                question: "When impersonating a user for testing, what is the best way to return to your account?",
                options: ["End Impersonation", "Clear browser cache", "Restart computer", "Log out and back in"],
                answer: [0],
                explanation: "Use the 'End Impersonation' option from the user menu to safely return to your original admin account.",
                multi: false
            },
            {
                id: 15,
                question: "Which type of tables may be extended by other tables but are not extended from another table?",
                options: ["Extended Tables", "Base Tables", "Custom Tables", "Core Tables"],
                answer: [1],
                explanation: "Base Tables (like Task) sit at the top of a table hierarchy — they can be extended by other tables but they don't extend any table themselves.",
                multi: false
            },
            {
                id: 16,
                question: "Which ServiceNow capability provides assistance to users via a messaging interface?",
                options: ["Chat GPT", "Agent Workspace", "Now Support", "Virtual Agent"],
                answer: [3],
                explanation: "Virtual Agent is ServiceNow's conversational chatbot platform that provides assistance through a messaging interface.",
                multi: false
            },
            {
                id: 17,
                question: "Which persona has clearly defined paths and workflows and has one or more roles (like itil and approver_user)?",
                options: ["Service Desk User", "Workflow User", "ITSM User", "Approving Manager", "Process User"],
                answer: [4],
                explanation: "Process Users follow defined workflows and have specific roles such as itil and approver_user assigned to fulfill their responsibilities.",
                multi: false
            },
            {
                id: 18,
                question: "Which concepts are associated with the CMDB? (Select 4 answers)",
                options: [
                    "User Permissions",
                    "The Dependency View",
                    "Service Processes",
                    "A Database",
                    "Tables and Fields"
                ],
                answer: [1, 2, 3, 4],
                explanation: "The CMDB is a database (structured as tables and fields) that supports the Dependency View to visualize CI relationships and underpins service processes.",
                multi: true
            },
            {
                id: 19,
                question: "In reporting, what does a metric do?",
                options: [
                    "A gauge on homepage",
                    "Measures and evaluates effectiveness of IT service management processes",
                    "Time measurement for SLAs",
                    "Comparative measurement for flows"
                ],
                answer: [1],
                explanation: "Metrics are used to measure and evaluate the effectiveness and performance of IT service management processes.",
                multi: false
            },
            {
                id: 20,
                question: "Which system property must be set to true to log impersonation events?",
                options: [
                    "glide.sys.log_impersonation",
                    "glide.sys.all_impersonation",
                    "glide.user_setting",
                    "glide.sys.admin_login",
                    "glide.impersonation_setting"
                ],
                answer: [0],
                explanation: "Setting glide.sys.log_impersonation to true enables logging of all impersonation activities in the system log.",
                multi: false
            },
            // ── Q21–Q30 ──
            {
                id: 21,
                question: "To apply a UI Policy to all views, which field should be set to true in its definition record?",
                options: ["Global", "On Load", "Reverse if false", "Inherit"],
                answer: [0],
                explanation: "Checking the 'Global' box on a UI Policy ensures it runs regardless of which view the user is in. If unchecked, you must specify the exact view it applies to.",
                multi: false
            },
            {
                id: 22,
                question: "A colleague wants to rearrange the columns on their My Work List. Once the user has navigated to the list, where should they navigate to select and arrange the columns?",
                options: [
                    "Click Personalize List",
                    "Click List Context Menu > Personalize List",
                    "Right click on any column header, Context Menu > Configure > List Layout",
                    "Click List Context Menu > Configure > List Layout"
                ],
                answer: [0],
                explanation: "Clicking the gear icon (Personalize List) personalizes the list only for yourself. 'Configure > List Layout' requires admin/specific role and changes it for all users.",
                multi: false
            },
            {
                id: 23,
                question: "Which one of the following is NOT a type of Visual Task Board?",
                options: ["Feature", "Freeform", "Guided boards", "Flexible"],
                answer: [0],
                explanation: "ServiceNow has three Visual Task Board types: Freeform (manually add tasks), Guided (lanes tied to a field's values), and Flexible (customizable lanes). 'Feature' is not a valid VTB type.",
                multi: false
            },
            {
                id: 24,
                question: "Which table stores the Task SLA records for the SLA's attached to particular tasks?",
                options: ["sla_task", "sla", "task_sla", "sla_value", "sla_definition"],
                answer: [2],
                explanation: "The task_sla table stores individual running SLA instances tracking time against specific task records. SLA definitions themselves are stored in the contract_sla table.",
                multi: false
            },
            {
                id: 25,
                question: "As an IT employee, what interface would you use to browse internal IT documentation like troubleshooting scripts and FAQs?",
                options: ["Stack Overflow", "SharePoint", "ServiceNow Wiki", "Knowledge"],
                answer: [3],
                explanation: "The Knowledge Management application is ServiceNow's native, centralized repository for sharing FAQs, troubleshooting guides, and organizational policies.",
                multi: false
            },
            {
                id: 26,
                question: "On the Reports page, what sections allow you to see which reports are visible to different audiences? (Select 4 answers)",
                options: ["All", "Department", "Group", "Team", "Global", "My reports"],
                answer: [0, 2, 4, 5],
                explanation: "ServiceNow categorizes report visibility into: My reports (created by you), Group (shared with your groups), Global (available to everyone), and All (combined view of everything you can access).",
                multi: true
            },
            {
                id: 27,
                question: "Which ServiceNow products can be used to discover and populate the CMDB? (Select 2 answers)",
                options: ["CMDB Plug-in", "Finder", "Discovery", "IntegrationHub ETL", "CMDB Integration Dashboard"],
                answer: [2, 3],
                explanation: "ServiceNow Discovery actively scans your network to find hardware/software for the CMDB. IntegrationHub ETL maps and imports CI data from third-party tools into the CMDB.",
                multi: true
            },
            {
                id: 28,
                question: "Where can we create SLAs, OLAs and Underpinning Contracts?",
                options: ["Incident Management", "Service Level Management", "Service Catalog", "Configuration Management"],
                answer: [1],
                explanation: "The Service Level Management (SLM) application handles the creation, monitoring, and management of SLAs, OLAs, and Underpinning Contracts across all ITSM processes.",
                multi: false
            },
            {
                id: 29,
                question: "What type of user (persona) has clearly defined paths and workflows in the platform and have one or more roles (ie itil and approver_user)?",
                options: ["Workflow User", "Process User", "Approving Manager", "Service Desk User", "ITSM User"],
                answer: [1],
                explanation: "A 'Process User' is an internal employee actively involved in following specific IT processes. They require specialized roles like itil or approver_user, differentiating them from simple Requesters.",
                multi: false
            },
            {
                id: 30,
                question: "A Role is defined as what?",
                options: [
                    "A collection of permissions",
                    "A set of access control rules",
                    "A Persona in a workflow",
                    "A set of user access policies"
                ],
                answer: [0],
                explanation: "A role in ServiceNow is a collection of permissions that dictates what a user or group can see and do — accessing apps, modules, and reading/writing specific records.",
                multi: false
            },
            // ── Q31–Q40 ──
            {
                id: 31,
                question: "Which type of scripts run in the client-side?",
                options: [
                    "Script Include Scripts",
                    "Business Rule Scripts",
                    "UI Policies and Client Scripts",
                    "Access Control Scripts"
                ],
                answer: [2],
                explanation: "In ServiceNow, 'client-side' means the script executes within the user's web browser. Client Scripts and UI Policies run on the client side to manage forms and fields in real-time. In contrast, Business Rules, Script Includes, and Access Controls (ACLs) run on the 'server-side' (the database and application server).",
                multi: false
            },
            {
                id: 32,
                question: "Which tool graphically displays an infrastructure view for a configuration item (CI) and its relationship with other CIs?",
                options: [
                    "Dependency View",
                    "Schema Map",
                    "Dependency Map",
                    "Database View"
                ],
                answer: [0],
                explanation: "Dependency Views provide a visual, interactive map of relationships between Configuration Items (CIs). They show how different pieces of your IT infrastructure connect and rely on one another. A 'Schema Map' shows relationships between database tables, not specific CIs.",
                multi: false
            },
            {
                id: 33,
                question: "While showing a customer their incident form, they ask to change the Priority values to display their internal terminology P1, P2, P3, P4. They want it to be consistent across all Tasks. How would you do that? Right click on Priority and select what?",
                options: [
                    "Configure Options",
                    "Configure Task",
                    "Show Choices",
                    "Configure Lists",
                    "Show Choice List",
                    "Show Options"
                ],
                answer: [4],
                explanation: "To modify the dropdown options (choices) for a field, you right-click the field label and select Show Choice List. Because the customer wants this consistent across all Tasks (and Incident extends the Task table), modifying the core choice list for the Priority field at the Task level is the correct administrative action.",
                multi: false
            },
            {
                id: 34,
                question: "Which section of the ServiceNow UI allows you to perform a global search?",
                options: [
                    "Content frame",
                    "Application Navigator",
                    "Banner frame",
                    "Record form"
                ],
                answer: [2],
                explanation: "The Banner Frame runs across the very top of the ServiceNow screen. It contains the logo, user profile menu, system settings gear, and the Global Search magnifying glass icon.",
                multi: false
            },
            {
                id: 35,
                question: "You are asked to create an option in the Service Catalog, which will allow a user to click Get Help and describe the issue they are having. These forms should create incident records, which are automatically routed to the Service Desk. Which method would you use?",
                options: [
                    "Create Catalog Item",
                    "Create Record Producer",
                    "Create Order Guide",
                    "Create Content Item"
                ],
                answer: [1],
                explanation: "A Record Producer is a specific type of Service Catalog item. Instead of ordering a tangible good (like a laptop), a Record Producer acts as a user-friendly frontend form that directly creates a task-based record (like an Incident or a Change Request) in the backend tables.",
                multi: false
            },
            {
                id: 36,
                question: "How is a user defined in ServiceNow?",
                options: [
                    "A user is a record stored in the User Preference [sys_user_preference] table",
                    "A user is a field in the LDAP integration",
                    "A user is a record stored in the User [sys_user] table",
                    "A user is a record stored in the Profile [sys_user_profile] table"
                ],
                answer: [2],
                explanation: "Every user profile in the ServiceNow system is stored as an individual record within the core User (sys_user) table.",
                multi: false
            },
            {
                id: 37,
                question: "What is the name of the string that displays filter criteria?",
                options: [
                    "Topic",
                    "Choice",
                    "Menu",
                    "Breadcrumb"
                ],
                answer: [3],
                explanation: "When you apply a filter to a list in ServiceNow, the active filter conditions are displayed horizontally as text links at the top of the list. These are called breadcrumbs (e.g., All > Active = true > Priority = 1 - Critical).",
                multi: false
            },
            {
                id: 38,
                question: "What is the purpose of a Related List?",
                options: [
                    "To dot-walk to a core table",
                    "To present related fields",
                    "To create a one-to-many relationship",
                    "To present related records"
                ],
                answer: [3],
                explanation: "Related Lists appear at the bottom of standard forms. They display lists of records from other tables that have a direct relationship to the record you are currently viewing. For example, on a Problem record, you might see a Related List of all Incident records tied to that Problem.",
                multi: false
            },
            {
                id: 39,
                question: "What is the best practice related to using the Default Update Set for moving customizations between instances?",
                options: [
                    "You should not use the Default Update sets for moving between instances",
                    "Merge Default update sets before moving between instances",
                    "Submit Default update set to application repository",
                    "Keep Default update set to maximum of 20 records, for troubleshooting purposes"
                ],
                answer: [0],
                explanation: "The Default Update Set is intended for routine, non-migratory system activities and shouldn't be moved. Best practice dictates that you create a newly named, specific Update Set (e.g., 'Portal_UI_Updates_v1') to capture your deliberate development work, and then move that set from Dev to Test to Prod.",
                multi: false
            },
            {
                id: 40,
                question: "Which framework can automatically populate values for the Priority and Category fields based on the Short description field value?",
                options: [
                    "Predictive Intelligence",
                    "UI Policy",
                    "Action",
                    "Assignment Rule",
                    "CSDM"
                ],
                answer: [0],
                explanation: "Predictive Intelligence uses machine learning models to analyze text (like a user typing 'My email is broken' into a Short Description) and automatically classify, route, or assign the record based on historical data patterns.",
                multi: false
            },
            // ── Q41–Q50 ──
            {
                id: 41,
                question: "On a form, which type of field has this icon which can be clicked, to see a preview of the associated record?",
                image: "images/q41.png",
                options: [
                    "Choice",
                    "Reference",
                    "Preview",
                    "Lookup",
                    "User"
                ],
                answer: [1],
                explanation: "The 'i' (information) icon is the universal indicator for a Reference field in ServiceNow. Reference fields store a link to another record in the system (in this case, the Caller field links to a record in the User table). Clicking that icon opens a read-only preview of that linked record.",
                multi: false
            },
            {
                id: 42,
                question: "What ServiceNow feature can be triggered by events, and is used to inform users about activities or updates in ServiceNow?",
                options: [
                    "Business Rules",
                    "Texts",
                    "Events",
                    "Notifications",
                    "Alerts"
                ],
                answer: [3],
                explanation: "Notifications are the standard mechanism used to send emails, SMS messages, or push notifications to users when specific conditions are met or events are fired (like an Incident being assigned to them).",
                multi: false
            },
            {
                id: 43,
                question: "Which statement is true about business rules?",
                options: [
                    "A business rule must not run before a database action occurs",
                    "A business rule can be a piece of Javascript",
                    "A business rule must run before a database action occurs",
                    "A business rule monitors fields on a form"
                ],
                answer: [1],
                explanation: "Business Rules are configured using server-side JavaScript. They can run before or after database actions. UI Policies/Client Scripts are what natively monitor fields on a form, not Business Rules.",
                multi: false
            },
            {
                id: 44,
                question: "When testing a catalog item having a manager approval flows, which of these best practices would you follow? (Select 3 answers)",
                options: [
                    "Create and select your Testing Update Set, before starting the test cases.",
                    "Impersonate the requester to ensure the form works.",
                    "Use the instance Incognito setting to quickly toggle between requester and approver.",
                    "Use your Admin account, so you can approve the items quickly.",
                    "Make sure the latest flows are activated.",
                    "Make sure the requester's user record has a manager specified."
                ],
                answer: [1, 4, 5],
                explanation: "To accurately test: 1) The requester must have a manager assigned or it skips. 2) You must impersonate the actual requester to see their exact view. 3) The Flow Designer flow must be activated.",
                multi: true
            },
            {
                id: 45,
                question: "What would NOT appear in the Application Navigator if 'service' is typed into the filter field?",
                options: [
                    "Incident > Assigned to me",
                    "Self-Service > Knowledge",
                    "Configuration > Business Services",
                    "Service Portal > Widgets"
                ],
                answer: [0],
                explanation: "The filter navigator does a text match against Application and Module names. 'service' appears in 'Self-Service', 'Business Services', and 'Service Portal', but NOT in 'Incident > Assigned to me'.",
                multi: false
            },
            {
                id: 46,
                question: "When creating a new notification, what must you define? (Select 3 answers)",
                options: [
                    "Under what conditions is the notification sent",
                    "The associated knowledge base",
                    "Who receives the notification",
                    "Settings for handing inactive user accounts",
                    "What the content of the notification"
                ],
                answer: [0, 2, 4],
                explanation: "A Notification record has three primary tabs to fill out: When to send (trigger conditions), Who will receive (recipients), and What it will contain (subject line and HTML body).",
                multi: true
            },
            {
                id: 47,
                question: "Which one of the following statements is a recommendation from ServiceNow about Update Sets?",
                options: [
                    "Use the Baseline Update Set to store the contents of items after they are changed the first time",
                    "Before moving customizations from instance to instance with Update Sets, ensure that both instances are different versions",
                    "Avoid using the Default Update set as an Update Set for moving customizations from instance to instance",
                    "Once an Update Set is closed as 'Complete', change it back to 'In Progress' until it is applied to another instance"
                ],
                answer: [2],
                explanation: "The Default update set is for local tweaks only. Best practice dictates creating a named, dedicated update set for development work. Update sets should never be moved between different versions.",
                multi: false
            },
            {
                id: 48,
                question: "When a user reports that they are not able to see modules on the application navigator, what can you do to see what modules are visible to them?",
                options: [
                    "Launch a NowChat window",
                    "Look up their password, so you can login with their account",
                    "Initiate a Connect Chat session",
                    "Impersonate the user"
                ],
                answer: [3],
                explanation: "The Impersonate User feature allows administrators to temporarily view the platform exactly as that specific user does, without needing their password. This immediately reveals their access level.",
                multi: false
            },
            {
                id: 49,
                question: "The Report Designer contains different sections for configuring your report. Which section is used to specify the name of the report, and the table or data source for the report?",
                options: [
                    "Configure",
                    "Design",
                    "Name",
                    "Data",
                    "Style"
                ],
                answer: [3],
                explanation: "The Report Designer workflow has four horizontal tabs: Data, Type, Configure, and Style. The first tab, 'Data', is where you provide the Report Name and choose its Table or Data Source.",
                multi: false
            },
            {
                id: 50,
                question: "On a filter condition, which component is always a choice list?",
                options: [
                    "Match Criteria",
                    "Filter Criteria",
                    "Operation",
                    "Operator"
                ],
                answer: [3],
                explanation: "A standard condition builder has three parts: Field, Operator, and Value. The Operator (e.g., 'is', 'contains') is always a choice list because the available options dynamically change based on the field type selected.",
                multi: false
            },
            // ── Q51–Q60 ──
            {
                id: 51,
                question: "If a knowledge base has no access details specified, what users are able to read articles in that knowledge base?",
                options: [
                    "Users with kb_user role",
                    "Any active user",
                    "Any user with an article's permalink",
                    "No users",
                    "itil users"
                ],
                answer: [1],
                explanation: "By default, if an administrator does not apply any specific User Criteria (rules that dictate who 'Can Read' or 'Cannot Read') to a Knowledge Base, it is open and accessible to all active, logged-in users in the platform.",
                multi: false
            },
            {
                id: 52,
                question: "What is a formatter? Select one of the following.",
                options: [
                    "A formatter allows you to populate fields automatically",
                    "A formatter allows you to configure applications on your instance",
                    "A formatter is a set of conditions applied to a table to help find and work with data",
                    "A formatter is a form element used to display information that is not a field in the record"
                ],
                answer: [3],
                explanation: "A formatter adds dynamic UI components to a form that aren't tied to a standard column in the database table. The most common example is the Activity Stream formatter, which displays a running history of comments and work notes at the bottom of an Incident or Task form.",
                multi: false
            },
            {
                id: 53,
                question: "When importing spreadsheet data into ServiceNow, what is the first step in the process?",
                options: [
                    "Load Data",
                    "Set Coalesce",
                    "Select Import Set",
                    "Define Data Source"
                ],
                answer: [0],
                explanation: "'Load Data' is the starting point for bringing information into the system. When you use the Load Data module to upload your spreadsheet, ServiceNow automatically creates the Data Source and the staging Import Set table for you so you can map it to the final target table.",
                multi: false
            },
            {
                id: 54,
                question: "What are the three key tables in an enterprise CMDB? (Select 3 answers)",
                options: [
                    "ci",
                    "cmdb",
                    "cmdb_rel_ci",
                    "sn_cmdb",
                    "sn_cmdb_bak",
                    "cmdb_bak",
                    "cmdb_ci"
                ],
                answer: [1, 2, 6],
                explanation: "The foundation of the Configuration Management Database relies on three core tables: cmdb (the absolute base Configuration Item table), cmdb_ci (the core Configuration Item table that extends the base and stores the actual CIs), and cmdb_rel_ci (the CI Relationship table, which stores the dependency links between different CIs).",
                multi: true
            },
            {
                id: 55,
                question: "Reports can be created from which different places in the platform? (Select 2 answers)",
                options: [
                    "Statistics module",
                    "Metrics module",
                    "View / Run module",
                    "List column heading"
                ],
                answer: [2, 3],
                explanation: "You can build a report through the dedicated Reports > View / Run module, which gives you the full Report Designer interface. Alternatively, for a quick chart, you can right-click any List column heading (like 'State' on an Incident list) and select 'Bar Chart' or 'Pie Chart' to instantly generate a report based on that data.",
                multi: true
            },
            {
                id: 56,
                question: "What is a Dictionary Override?",
                options: [
                    "A Dictionary Override is a task within a workflow that requests an action before the workflow can continue",
                    "A Dictionary Override is an incoming customer update in an update set which applies to the same object as a new local customer update.",
                    "A Dictionary Override sets field properties in extended tables.",
                    "A Dictionary Override is the addition, modification, or removal of anything that could have an effect on IT services"
                ],
                answer: [2],
                explanation: "Dictionary Overrides allow you to change how a field behaves on a child table without affecting the parent table. For example, the 'State' field is defined on the parent task table. Using a Dictionary Override, you can make 'State' mandatory specifically on the incident table, without making it mandatory for all other types of tasks.",
                multi: false
            },
            {
                id: 57,
                question: "What catalog tool would you use to create a catalog item or record producer?",
                options: [
                    "Catalog Formatter",
                    "Workflow Designer",
                    "Catalog Designer",
                    "Catalog Builder"
                ],
                answer: [3],
                explanation: "The Catalog Builder is a visual, step-by-step guided experience used to create and edit Service Catalog items and Record Producers. It was designed to allow non-technical business owners to build catalog items without needing deep administrative development knowledge.",
                multi: false
            },
            {
                id: 58,
                question: "What are the three components of a filter condition?",
                options: [
                    "Operator",
                    "Record",
                    "Value",
                    "Table",
                    "Field"
                ],
                answer: [0, 2, 4],
                explanation: "Whenever you build a condition (like a list filter or a Business Rule trigger), it always requires three parts: The Field you are evaluating (e.g., 'Priority'), the Operator establishing the logic (e.g., 'is'), and the Value you are checking against (e.g., '1 - Critical').",
                multi: true
            },
            {
                id: 59,
                question: "Which one of the following statements best describes the purpose of an Update Set?",
                options: [
                    "An Update Set allows administrators to group a series of changes into a named set and then move this set as a unit to other systems",
                    "An Update Set is a group of customizations that is moved from Production to Development",
                    "By default, the changes included in an Update Set are visible only in the instance to which they are applied",
                    "By default, an Update Set includes customizations, Business Rules, and homepages"
                ],
                answer: [0],
                explanation: "Update Sets act as transport containers. As you build new features (like new tables, scripts, or UI policies) in your Development instance, they are captured in an Update Set. Once complete, you export that set and import it into Test or Production, ensuring your changes migrate cleanly as a single package.",
                multi: false
            },
            {
                id: 60,
                question: "What are benefits of assigning work tasks to a group, rather than to an individual? (Select 4 answers)",
                options: [
                    "Groups can assign tasks to users based on availability",
                    "Group members can choose their tasks from My Groups Work",
                    "Site support members can pick tasks, based on Location",
                    "Groups can assign tasks to users based on on-call schedules",
                    "Group members can avoid tasks, which are nearing SLA breach",
                    "Groups can assign tasks to users based on skills"
                ],
                answer: [0, 2, 3, 5],
                explanation: "Assigning a ticket to a group first (like 'Network Support') rather than a specific person ensures the ticket isn't bottlenecked if an individual is busy or absent. It allows the group manager (or automated routing) to distribute the work intelligently based on who is available, who is physically near the issue (location), who is actively on-call, or who has the specific technical skills required to solve it.",
                multi: true
            }
            // ── More questions will be added here ──
        ]
    },
    3: {
        name: "Practice Test 3",
        total: 60,
        questions: [
            // ── Q1–Q10 ──
            {
                id: 1,
                question: "Which of the following are not included in an Update Set, by default? (Select 4 answers)",
                options: [
                    "Data",
                    "Scheduled Jobs",
                    "Related Lists",
                    "New Users and Groups",
                    "New CI",
                    "Report Definitions"
                ],
                answer: [0, 1, 3, 4],
                explanation: "By default, Update Sets capture configuration and customization elements (like Report Definitions, Related Lists, and Business Rules). They explicitly do NOT capture data records (like CIs, Users, Groups, or transactional data) nor do they capture Scheduled Jobs, to prevent accidentally overwriting live data or running processes when moved to target instances.",
                multi: true
            },
            {
                id: 2,
                question: "Which is the base table of the configuration management database hierarchy?",
                options: [
                    "cmdb",
                    "ci_cmdb",
                    "cmdb_rel_ci",
                    "cmdb_ci"
                ],
                answer: [0],
                explanation: "The cmdb table is the absolute base, root table for the Configuration Management Database hierarchy. The cmdb_ci table extends this base table to store the actual Configuration Items.",
                multi: false
            },
            {
                id: 3,
                question: "Which one of the following statements is true about Column Context Menus?",
                options: [
                    "It displays actions related to filtering options, assigning tags, and search",
                    "It displays actions related to viewing and filtering the entire list",
                    "It displays actions such as creating quick reports, configuring the list, and exporting data",
                    "It displays actions such as view form, view related task, and add relationship"
                ],
                answer: [2],
                explanation: "The Column Context Menu (accessed by clicking the hamburger icon or right-clicking a column header) provides column-specific administrative and reporting actions like 'Bar Chart', 'Export', and 'Configure > List Layout'.",
                multi: false
            },
            {
                id: 4,
                question: "Which modules can you use to create a new table? (Select 2 answers)",
                options: [
                    "Applications",
                    "Schema Map",
                    "Tables",
                    "Tables & Columns",
                    "Database"
                ],
                answer: [2, 3],
                explanation: "You can create new custom tables in ServiceNow by navigating to System Definition > Tables or System Definition > Tables & Columns. The Schema Map is purely for visualizing database relationships, not creating them.",
                multi: true
            },
            {
                id: 5,
                question: "Which allows the creation of a task-based record from Service Catalog?",
                options: [
                    "Flow Designer",
                    "UI Builder",
                    "Record Producers",
                    "Assignment Rule"
                ],
                answer: [2],
                explanation: "A Record Producer is a specific type of Service Catalog item that acts as a user-friendly frontend form to directly create a task-based record (like an Incident or a Change Request) in the backend, rather than generating a standard Requested Item (RITM).",
                multi: false
            },
            {
                id: 6,
                question: "What is a role in ServiceNow?",
                options: [
                    "A role is one record in the Role [user_sys_role] table",
                    "A role is a persona used in Live Feed Chat",
                    "A role is a set of modules for a particular application",
                    "A role is one record in the Role [sys_user_role] table"
                ],
                answer: [3],
                explanation: "In ServiceNow's backend data structure, every role in the platform is defined as an individual record within the core sys_user_role table.",
                multi: false
            },
            {
                id: 7,
                question: "Tables may have a One to Many relationships. From the Service Catalog, what are examples of tables having a one to many relationships? (Select 3 answers)",
                options: [
                    "One Approval can have many Requests",
                    "One Cart can have many Requests",
                    "One Request can have many Requested Items",
                    "One Requested Item can have many Approvals",
                    "One Requested Item can have many Catalog Tasks"
                ],
                answer: [2, 3, 4],
                explanation: "In the Service Catalog fulfillment hierarchy, a single overarching Request (REQ) can contain multiple individual Requested Items (RITMs). Furthermore, a single RITM can require multiple Approvals and trigger multiple separate Catalog Tasks (SCTASKs) to complete fulfillment.",
                multi: true
            },
            {
                id: 8,
                question: "What is common between CIs, Users, Groups?",
                options: [
                    "They are stored in the same base table cmdb",
                    "Any changes to these are not captured in an update set",
                    "sys_db_object is parent of all tables",
                    "All changes to these are captured in an update set"
                ],
                answer: [1],
                explanation: "CIs (Configuration Items), Users, and Groups are classified as base data records rather than system configurations. Update Sets track configuration changes (like scripts and UI layouts) and inherently ignore basic data records.",
                multi: false
            },
            {
                id: 9,
                question: "The display sequence is controlled in a Service Catalog Item using which of the following?",
                options: [
                    "The Order field in the Variable form",
                    "The Sequence field in the Catalog Item form",
                    "The Default Value field in the Catalog Item form",
                    "The Choice field in the Variable form"
                ],
                answer: [0],
                explanation: "When you create input variables for a Service Catalog Item (like text boxes or dropdowns), the visual top-to-bottom sequence they display on the form is dictated by the integer value placed in the Order field of each respective variable.",
                multi: false
            },
            {
                id: 10,
                question: "What role can edit ACLs?",
                options: [
                    "acl_admin",
                    "admin",
                    "security_admin",
                    "system_admin"
                ],
                answer: [2],
                explanation: "Access Control Lists (ACLs) manage core security and table permissions. To create or modify ACLs, a user must have the high-privilege security_admin role. Standard admins must actively 'elevate' their privileges to temporarily act as a security_admin to perform these edits.",
                multi: false
            },
            // ── Q11–Q20 ──
            {
                id: 11,
                question: "On a related list, which buttons are commonly used for managing the records on the list? (Select 3 answers)",
                options: [
                    "New",
                    "Manage",
                    "Publish",
                    "Add",
                    "Edit"
                ],
                answer: [0, 3, 4],
                explanation: "On a related list, New creates a brand-new record directly on that related child table. Edit opens a slushbucket to associate existing records (commonly used in many-to-many relationships). Add is also used to associate existing records depending on the specific list and workspace configuration.",
                multi: true
            },
            {
                id: 12,
                question: "A new Service Desk employee in Latin America complains that the create dates and times are incorrect on their Incident list. What would you suggest to fix this issue?",
                options: [
                    "Have them clear their cache.",
                    "Recommend they use Chrome, instead of Explorer.",
                    "Have them use the gear icon to set the employee's time zone.",
                    "Use the system properties to correct the instance's time zone.",
                    "Have them correct the time zone on their computer."
                ],
                answer: [2],
                explanation: "ServiceNow stores all times in UTC in the backend database. How that time is displayed to a user is dictated by their personal profile settings. Clicking the gear icon (System Settings) in the top-right banner frame allows them to set their localized time zone without affecting anyone else in the instance.",
                multi: false
            },
            {
                id: 13,
                question: "How is the Event Log different from the Event Registry?",
                options: [
                    "Event Log is the same as the Event Registry",
                    "Event Log is formatted in the Log style, the Event Registry displays different fields",
                    "Event Log lists Events that were triggered by integrations, the Event Registry lists the Events that were triggered during the day (24-hour period)",
                    "Event Log contains generated Events, the Event Registry is a table of Event definitions"
                ],
                answer: [3],
                explanation: "The Event Registry (sysevent_register) is simply a dictionary—it tells the platform that a specific event exists and what it does. The Event Log (sysevent) is the actual running history; it records every single time one of those events is fired or triggered.",
                multi: false
            },
            {
                id: 14,
                question: "What are the steps for importing data using an import set?",
                options: [
                    "Identity source; Import transform map; Run transformer, Verify import",
                    "Load the data; Create transform map; Transform data; Clean up import table",
                    "Setup LDAP; Test map; Create update set; Run import; Apply update set",
                    "Select source file; Run automap; Transform data; Clean up target table"
                ],
                answer: [1],
                explanation: "This is the standard 4-step data import process in ServiceNow. You bring the data into a staging table (Load), map the staging table columns to the final target table columns (Create map), run the script to actually move the data (Transform), and then clear out the temporary staging data (Clean up).",
                multi: false
            },
            {
                id: 15,
                question: "What is SLA?",
                options: [
                    "ServiceNow Level Agreement",
                    "System Level Agreement",
                    "Service Level Agreement",
                    "System Level Metadata"
                ],
                answer: [2],
                explanation: "A Service Level Agreement (SLA) is a commitment between a service provider and a client. In ServiceNow, it's used to track the time it takes to respond to or resolve tasks like Incidents, ensuring teams meet their agreed-upon deadlines.",
                multi: false
            },
            {
                id: 16,
                question: "Which module would you use to create a new automation of business logic such as approvals, tasks, and notifications?",
                options: [
                    "Process Automation > Process Flow",
                    "Process Automation > Flow Designer",
                    "Process Automation > Active Flows",
                    "Process Automation > Flow Administration",
                    "Process Automation > Workflow Editor"
                ],
                answer: [1],
                explanation: "Flow Designer is ServiceNow's modern, non-code interface for automating business processes. While the older 'Workflow Editor' still exists, Flow Designer is the best-practice standard for building out logic for approvals, task generation, and notifications.",
                multi: false
            },
            {
                id: 17,
                question: "On a filter condition, there is an element, which is based on the table, the user access rights, and columns on the table. What is this element called?",
                options: [
                    "Label",
                    "Field",
                    "Column",
                    "Attribute",
                    "Table"
                ],
                answer: [1],
                explanation: "A filter condition consists of three parts: Field, Operator, and Value. The Field dropdown dynamically populates based on which table you are filtering against and whether your specific user role (Access Controls) actually has permission to view those columns.",
                multi: false
            },
            {
                id: 18,
                question: "Access Control rules may be defined with which of the following permission requirements? (Select 3 answers)",
                options: [
                    "Groups",
                    "User Criteria",
                    "Roles",
                    "Conditional Expressions",
                    "Scripts"
                ],
                answer: [2, 3, 4],
                explanation: "Access Control Lists (ACLs) check security at three distinct levels, and a user must pass all configured checks to gain access. These include: Roles (does the user have the itil role?), Conditional Expressions (is the Incident 'Active = True'?), and Scripts (custom server-side JavaScript logic).",
                multi: true
            },
            {
                id: 19,
                question: "What is a schema map?",
                options: [
                    "A schema map graphically organizes the visual task boards for the CMDB",
                    "A schema map displays the details of tables and their relationships in a visual manner, allowing administrators to view and easily access different parts of the database schema",
                    "A schema map enables administrators to define records from specific tables as trouble sources for Configuration Items",
                    "A schema map graphically displays the Configuration Items that support a business service"
                ],
                answer: [1],
                explanation: "Found under System Definition > Tables & Columns, the Schema Map provides a visual web showing how different tables in the ServiceNow relational database connect to each other (e.g., showing that the incident table extends the task table, and is referenced by the sys_user table).",
                multi: false
            },
            {
                id: 20,
                question: "When creating a global custom table named abc, what is the table name that is automatically assigned by the platform?",
                options: [
                    "snc_abc",
                    "u_abc",
                    "sys_abc",
                    "abc"
                ],
                answer: [1],
                explanation: "To differentiate standard out-of-the-box tables from tables created by customers, ServiceNow automatically prefixes any custom-built table in the global scope with u_ (standing for user-defined).",
                multi: false
            },
            // ── Q21–Q30 ──
            {
                id: 21,
                question: "On Access Control Definitions, what are ways you can set the permissions on a Table? (Select 3 answers)",
                options: [
                    "CRUD",
                    "Roles",
                    "Conditional Expressions",
                    "Groups",
                    "Script that sets the answer variable to true or false"
                ],
                answer: [1, 2, 4],
                explanation: "Access Control Lists (ACLs) in ServiceNow use three specific mechanisms to grant or deny access to a record or field. A user must pass all three checks (if configured): Roles (e.g., they must have itil), Conditions (e.g., the record State is Active), and Scripts (server-side JS must evaluate to true).",
                multi: true
            },
            {
                id: 22,
                question: "Which best describes a field in a ServiceNow table?",
                options: [
                    "A field is a table row.",
                    "A field is a table cell that stores data.",
                    "A field is an item that appears in a menu list.",
                    "A field is a record in a table."
                ],
                answer: [1],
                explanation: "Think of a ServiceNow table like a spreadsheet. A record is an entire row (e.g., a single Incident). A column represents the type of data (e.g., 'Priority'). A field is the intersection of the two—a single cell storing specific data for that specific record (e.g., '1 - Critical').",
                multi: false
            },
            {
                id: 23,
                question: "Tables may be set up with Many to Many relationships. What is a classic example of a scenario where the tables would have many to many relationships?",
                options: [
                    "Requests can contain many Items; and Items can be any item from the catalog.",
                    "A Configuration Item can belong to multiple Classes, and Classes can contain multiple Configuration Items.",
                    "Vendors can sell multiple products; and products can be sold by multiple vendors.",
                    "A Task can trigger many Workflows; and a Workflow can trigger many Tasks."
                ],
                answer: [2],
                explanation: "A Many-to-Many (M2M) relationship means multiple records in Table A can link to multiple records in Table B. The Vendor/Product scenario is the textbook example: Dell (Vendor) sells laptops and monitors (Products), and Laptops (Product) can be sold by Dell, HP, and Apple (Vendors).",
                multi: false
            },
            {
                id: 24,
                question: "An IT user calls the service desk because they need to work on task records. All they can see is Self Service on their homepage when they login to the ServiceNow instance. What issue could explain this? (Select 2 answers)",
                options: [
                    "Their user account failed LDAP authentication",
                    "Their user account is not logged in properly",
                    "Their user account does not belong to any groups, which contain the itil role",
                    "Their user account does not have itil role",
                    "Their user account was not approved by their manager"
                ],
                answer: [2, 3],
                explanation: "The itil role is the foundational permission required for an internal employee to view, update, or manage standard ITSM task records (Incidents, Problems). If a user only sees 'Self Service', they act as a standard end-user because they lack the itil role, either explicitly assigned or inherited through an assignment group.",
                multi: true
            },
            {
                id: 25,
                question: "Which technique is used to get information from a series of referenced fields from different tables?",
                options: [
                    "Dot-Walking",
                    "Record-Hopping",
                    "Table-Walking",
                    "Sys_ID Pulling"
                ],
                answer: [0],
                explanation: "Dot-walking allows you to access data across related tables without writing complex code. If you are on an Incident form and want to pull the Caller's Manager's Email, you use dot-walking through the reference fields: caller_id.manager.email.",
                multi: false
            },
            {
                id: 26,
                question: "What table extends the problem_task table?",
                options: [
                    "Task",
                    "There is no table such as problem_task",
                    "Problem",
                    "It does not extend any table"
                ],
                answer: [0],
                explanation: "Note: The phrasing of this exam question usually implies 'What table DOES the problem_task table extend?'. The core task table is the parent. The problem_task child table extends the base task table, inheriting all standard fields (State, Assigned To) while adding Problem-Task specific fields.",
                multi: false
            },
            {
                id: 27,
                question: "Which testing framework is used to test ServiceNow Applications?",
                options: [
                    "Selenium",
                    "Test Driven Framework (TDF)",
                    "Junit",
                    "Automated Test Framework (ATF)"
                ],
                answer: [3],
                explanation: "The Automated Test Framework (ATF) is ServiceNow's native, built-in application for creating and running automated tests. It is heavily used before platform upgrades to ensure custom apps and configurations haven't broken.",
                multi: false
            },
            {
                id: 28,
                question: "You cannot deactivate a plugin, once it has been activated.",
                options: [
                    "True",
                    "False"
                ],
                answer: [0],
                explanation: "This is a critical platform rule. Once you activate a plugin in a ServiceNow instance, you cannot deactivate or delete it. If you no longer want to use it, you can hide its modules or disable its specific business rules, but the core data architecture and tables remain permanently in the instance.",
                multi: false
            },
            {
                id: 29,
                question: "What access does a user need to be able to import articles to a knowledge base?",
                options: [
                    "end_user",
                    "sn_knowledge_import",
                    "sn_knowledge_contribute",
                    "knowledge"
                ],
                answer: [3],
                explanation: "The standard 'knowledge' role is required for users to create, edit, or import articles into a Knowledge Base. The sn_knowledge_ prefixed roles are distractor options.",
                multi: false
            },
            {
                id: 30,
                question: "Which module is used to access the knowledge bases which are available to particular non-admin user?",
                options: [
                    "Knowledge > Knowledge Bases",
                    "Knowledge > Home",
                    "Self Service > Knowledge",
                    "Knowledge > All",
                    "Knowledge > Overview"
                ],
                answer: [2],
                explanation: "While IT fulfillers might use modules under the dedicated 'Knowledge' application menu, standard end-users (non-admins, without ITIL roles) typically navigate to Self Service > Knowledge to access the portal to search for FAQs and troubleshooting guides.",
                multi: false
            },
            // ── Q31–Q40 ──
            {
                id: 31,
                question: "What is a no-code approach to control the mandatory or read-only state of a form field?",
                options: [
                    "UI Script",
                    "Client Script",
                    "UI Rule",
                    "UI Action",
                    "UI Policy"
                ],
                answer: [4],
                explanation: "A UI Policy offers a no-code, declarative way to dynamically change form fields (making them mandatory, read-only, or hidden) based on specific conditions. Client Scripts and UI Scripts require writing JavaScript.",
                multi: false
            },
            {
                id: 32,
                question: "Access Control rules are applied to a specific table, like the Incident table. What is the object name for a rule that is specific to the Incident table and the Major Incident field?",
                options: [
                    "incident||major_incident",
                    "Incident.Major_Incident",
                    "incident=>major_incident",
                    "incident.major_incident",
                    "incident<=>major_incident"
                ],
                answer: [3],
                explanation: "In ServiceNow Access Control Lists (ACLs), field-level rules are defined using the strict syntax table_name.field_name, with the system names written in all lowercase.",
                multi: false
            },
            {
                id: 33,
                question: "Your company is giving all first line workers a special T-shirt as a recognition for their hard work. Management team wants a way for employees to order the T-shirt, with the ability to specify the preferred size and color. How would you ensure that only first line workers (non-managers) can submit the order?",
                options: [
                    "Create Catalog Item and use the Not Available list to specify the Manager Group",
                    "Create Record Producer and use the Available For list to specify First Line [sn_first_line] role",
                    "Create Order Guide and use the User Criteria list to specify First Line [sn_first_line] role",
                    "Create Catalog Item and use the Available For list to specify ITIL [itil] role"
                ],
                answer: [0],
                explanation: "Creating a Catalog Item is the correct approach for ordering physical goods. To restrict access, you use User Criteria. Applying the Manager Group to the 'Not Available For' related list ensures that managers cannot see or order the item, leaving it properly available for the rest of the workers.",
                multi: false
            },
            {
                id: 34,
                question: "Categories in the knowledge base, by default, can be created and edited by which knowledge workers? (Select 2 answers)",
                options: [
                    "Knowledge Authors",
                    "Knowledge Managers",
                    "Knowledge Contributors",
                    "Knowledge User",
                    "Knowledge Controller"
                ],
                answer: [1, 2],
                explanation: "In Knowledge Management, users specifically acting as Knowledge Managers and Knowledge Contributors have the baseline authority to define and structure the categories within a Knowledge Base to keep articles organized.",
                multi: true
            },
            {
                id: 35,
                question: "Which features ensures data consistency while importing data using import sets and web services?",
                options: [
                    "UI Policy",
                    "Client Script",
                    "Business Rule",
                    "Data Policy",
                    "ACL"
                ],
                answer: [3],
                explanation: "Data Policies enforce data consistency by setting mandatory and read-only states at the database level (server-side). This means they run regardless of how the data enters the system—whether via a user clicking a form, an import set loading, or an API/web service call. UI Policies, on the other hand, only run on the browser UI.",
                multi: false
            },
            {
                id: 36,
                question: "Which of the following are a type of client scripts supported in ServiceNow? (Select 4 answers)",
                options: [
                    "onUpdate",
                    "onChange",
                    "onLoad",
                    "onSave",
                    "onEdit",
                    "onSubmit",
                    "onCellEdit"
                ],
                answer: [1, 2, 5, 6],
                explanation: "The four standard triggers for Client Scripts in ServiceNow are onLoad (runs when the form opens), onChange (runs when a specific field value is altered), onSubmit (runs when the form is saved), and onCellEdit (runs when a list field value is updated via the list view).",
                multi: true
            },
            {
                id: 37,
                question: "What module do you use to access the reports that are available to you?",
                options: [
                    "Self-Service > My Reports",
                    "Self-Service > My Dashboards",
                    "Reports > Homepage",
                    "Reports > Overview",
                    "Reports > View / Run"
                ],
                answer: [4],
                explanation: "The standard application path to access the Report Designer interface, as well as the categorized lists of all reports you have permission to view or edit, is Reports > View / Run.",
                multi: false
            },
            {
                id: 38,
                question: "On what part of the ServiceNow instance, would you find the option to Impersonate User?",
                options: [
                    "Content Frame",
                    "Module",
                    "Application Navigator",
                    "User Menu"
                ],
                answer: [3],
                explanation: "The Impersonate User option is located within the User Menu, which drops down when you click your user avatar or name in the top-right corner of the banner frame.",
                multi: false
            },
            {
                id: 39,
                question: "What type of query allows you to filter list data using normal words, instead of the condition builder?",
                options: [
                    "Auto-suggest Query",
                    "Machine Learning Query",
                    "Alexa Query",
                    "Predictive Intelligence Query",
                    "Natural Language Query"
                ],
                answer: [4],
                explanation: "Natural Language Query (NLQ) allows users to type plain English phrases (like 'show me active incidents assigned to network support') into list filters or analytics hubs, which the platform automatically translates into standard system query logic.",
                multi: false
            },
            {
                id: 40,
                question: "To retrieve an update set from a remote instance, in the Production instance, navigate to:",
                options: [
                    "All > System Update Sets > Update Sources",
                    "All > System Update Sets > Retrieved Sources",
                    "All > System Update Sets > Committed Sources",
                    "All > System Definition > Update Sources",
                    "All > Update Sets > Update Sources"
                ],
                answer: [0],
                explanation: "When pulling an Update Set from a Development environment into Test or Production, you must define the remote instance as an 'Update Source'. Navigating to System Update Sets > Update Sources allows you to connect to that instance and pull the completed packages.",
                multi: false
            },
            // ── Q41–Q50 ──
            {
                id: 41,
                question: "Which tool is used to define relationships between fields in an import set table and a target table?",
                options: [
                    "Dictionary Map",
                    "Schema Map",
                    "Import Designer",
                    "Transform Map"
                ],
                answer: [3],
                explanation: "A Transform Map provides the explicit guide for moving data from temporary import set tables (the staging area) into the final 'target' tables in ServiceNow. It allows you to map which column in your spreadsheet corresponds to which specific field in the system (e.g., mapping 'Emp_ID' to the 'User ID' field).",
                multi: false
            },
            {
                id: 42,
                question: "Automated Chatting agent available on the service portal is commonly referred to as?",
                options: [
                    "Alexa",
                    "Chatbot",
                    "Agentless Bot",
                    "Virtual Agent"
                ],
                answer: [3],
                explanation: "Virtual Agent is ServiceNow's official native conversational bot platform. It is designed to interact with users on the Service Portal to provide quick information, handle self-service requests, and automate common tier-1 IT support tasks.",
                multi: false
            },
            {
                id: 43,
                question: "Elevated roles are available for only one session.",
                options: [
                    "True",
                    "False"
                ],
                answer: [0],
                explanation: "High-security roles (like security_admin) require you to manually 'Elevate Roles' from your user profile menu. As a security measure, this elevation is temporary and only lasts for your current active session. If you log out or your session times out, you must re-elevate upon logging back in.",
                multi: false
            },
            {
                id: 44,
                question: "When working on a form, what is the difference between Insert and Update operations?",
                options: [
                    "Insert saves changes and remains on the form, Update saves changes and exits the form",
                    "Insert creates a new record and Update saves changes, both exit the form",
                    "Insert creates a new record and Update saves changes, both remain on the form",
                    "Insert saves changes and exits the form, Update saves changes and remains on the form"
                ],
                answer: [1],
                explanation: "When you are interacting with a form in the standard UI, clicking 'Insert' creates a brand-new database record and navigates you back to the previous list view. Clicking 'Update' saves modifications to an existing record and also navigates you back to the list. (If you wanted to stay on the form, you would use 'Insert and Stay' or 'Save').",
                multi: false
            },
            {
                id: 45,
                question: "Which tool is used for creating dependencies between configuration items in the CMDB?",
                options: [
                    "CI Service Manager",
                    "CMDB Builder",
                    "CI Relationship Editor",
                    "CI Class Manager"
                ],
                answer: [3],
                explanation: "The CI Class Manager provides a centralized interface for administrators to view and manage the CMDB class hierarchy. While the CI Relationship Editor is used to manually link individual records, the CI Class Manager is where you establish overarching rules, suggested relationships, and dependencies for entire classes of CIs.",
                multi: false
            },
            {
                id: 46,
                question: "A department manager asks an analyst to build some reports. Where do you recommend the analyst start?",
                options: [
                    "Self-Service > Reports",
                    "Report Dashboard > Create New",
                    "Reports > Create New",
                    "Performance Analytics > Reports",
                    "Reports > Getting Started"
                ],
                answer: [2],
                explanation: "The most direct, out-of-the-box navigation path to build a new report in the platform is through the Application Navigator by going to Reports > Create New. This opens the standard Report Designer interface.",
                multi: false
            },
            {
                id: 47,
                question: "What resource can you use to view details of the tables and configuration items (CIs) associated with a particular use case?",
                options: [
                    "Scenario Dashboard",
                    "Common Service Data Model (CSDM) product view",
                    "CI Use Case Modeler",
                    "CMDB Use Case Modeler"
                ],
                answer: [1],
                explanation: "The Common Service Data Model (CSDM) is a framework and set of best-practice guidelines for mapping IT services and applications in the CMDB. The CSDM product view provides the specific structural blueprints for how different tables and CI classes should relate to one another for specific business use cases.",
                multi: false
            },
            {
                id: 48,
                question: "What are the steps for applying an update set to an instance?",
                options: [
                    "Retrieve, Preview, Commit",
                    "Pull, Review, Push",
                    "Get, Test, Push",
                    "Retrieve, Assess, Apply",
                    "Specify, Transform, Apply"
                ],
                answer: [0],
                explanation: "When migrating development work (an Update Set) into a new instance, you must follow three strict phases:\n\nRetrieve: Pull the completed update set from the source instance.\n\nPreview: Let the system run automated conflict checks against your current environment.\n\nCommit: Permanently apply the changes to the local database.",
                multi: false
            },
            {
                id: 49,
                question: "From the User menu, which actions can a user select? (Select 3 answers)",
                options: [
                    "Settings",
                    "Log out",
                    "Elevate role",
                    "Impersonate user",
                    "Send message"
                ],
                answer: [1, 2, 3],
                explanation: "The User menu is accessed by clicking your profile name/avatar in the top-right banner frame. From here, users with appropriate permissions can Log out, Impersonate user (to see the platform as someone else), and Elevate role (to access high-security permissions). 'Settings' is accessed via the separate gear icon next to the profile.",
                multi: true
            },
            {
                id: 50,
                question: "In what order are Access Controls evaluated?",
                options: [
                    "Table-level - most specific to most general; then Field-level - most specific to most general",
                    "Field-level - most specific to most general; then Table-level - most specific to most general",
                    "Field-level - most general to most specific; then Row-level - most specific to most general",
                    "Table-level - most specific to most general, then Row-level - most specific to most general"
                ],
                answer: [0],
                explanation: "When evaluating security (ACLs), ServiceNow always checks the broad container first before checking the contents.\n\nIt checks Table-level access first (e.g., checking incident table, then the parent task table). If the user cannot access the table, access is immediately denied.\n\nIf table access is granted, it then repeats the specific-to-general check at the Field-level (e.g., checking the incident.priority field, then task.priority, then *.* for wildcard fields).",
                multi: false
            },
            // ── Q51–Q60 ──
            {
                id: 51,
                question: "Which banner icon do you use to change your personal system settings, like your instance color scheme?",
                options: [
                    "Magnifier",
                    "Gear",
                    "Question mark",
                    "Chat bubbles"
                ],
                answer: [1],
                explanation: "The Gear icon, located in the top-right corner of the Banner Frame, opens the System Settings menu. This is where an individual user can personalize their workspace experience, including changing the UI theme, setting their personal time zone, and adjusting accessibility settings.",
                multi: false
            },
            {
                id: 52,
                question: "On the knowledge base record, which tab would you use to define which users are not able to write articles to the knowledge base?",
                options: [
                    "Cannot Author",
                    "Read Only",
                    "Cannot Write",
                    "Cannot Contribute"
                ],
                answer: [3],
                explanation: "Knowledge Management uses User Criteria to control access. The rules that dictate who can view articles are placed in the 'Can Read' or 'Cannot Read' related lists. The rules that dictate who can create, modify, or retire articles (i.e., write to the knowledge base) are placed in the 'Can Contribute' or 'Cannot Contribute' related lists.",
                multi: false
            },
            {
                id: 53,
                question: "On Access Control Definitions, what are ways you can set the permissions on a Table? (Select 3 answers)",
                options: [
                    "Groups",
                    "Conditional Expressions",
                    "Script that sets the answer variable to true or false",
                    "CRUD",
                    "Roles"
                ],
                answer: [1, 2, 4],
                explanation: "Access Control Lists (ACLs) evaluate three distinct criteria to grant access. A user must pass all configured checks:\n\nRoles: Does the user have a specific role (like itil)?\n\nConditional Expressions: Does the record meet specific criteria (like State is Active)?\n\nScripts: Does a server-side JavaScript evaluate and return true?",
                multi: true
            },
            {
                id: 54,
                question: "Where is data stored?",
                options: [
                    "Record",
                    "Form",
                    "Table",
                    "List"
                ],
                answer: [2],
                explanation: "In ServiceNow's relational database architecture, all actual data is stored in backend Tables. A Record is just a single row of that data, and Forms and Lists are simply the user-friendly UI interfaces used to view and interact with the data stored in those tables.",
                multi: false
            },
            {
                id: 55,
                question: "When looking at a long list of records, you want to quickly filter, to show only those which have Category of Hardware. How might you do that?",
                options: [
                    "On the Category column header, right click and select Show > Hardware",
                    "On Breadcrumb, click > icon, type Hardware and click enter",
                    "Right click on magnifier, type Hardware and click enter",
                    "On the list, locate and right click on the value Hardware, select Show Matching",
                    "Click Funnel icon, type Hardware and click enter"
                ],
                answer: [3],
                explanation: "The fastest, most efficient way to filter a list in ServiceNow is to find the exact value you want within the list itself, right-click that cell, and select Show Matching. (Conversely, you can select 'Filter Out' to remove records with that value).",
                multi: false
            },
            {
                id: 56,
                question: "An IT manager is responsible for the Network and Hardware assignment groups, each group contains 5 team members. These team members are working on many tasks, but the manager cannot see any tasks on the Service Desk > My Groups Work list. What could explain this?",
                options: [
                    "The manager is not a member of the Service Desk group.",
                    "The manager is not a member of the Network and Hardware groups.",
                    "The Service Desk > My Groups Work list shows active work tasks that are not yet assigned.",
                    "The manager does not have the itil role."
                ],
                answer: [2],
                explanation: "The 'My Groups Work' module is a specific out-of-the-box filter designed to show unassigned group queue items. Its underlying filter logic strictly states that the assigned_to field must be empty. Because the 5 team members are actively 'working on' the tasks, those tasks already have an individual assignee, and thus immediately fall off the 'My Groups Work' list.",
                multi: false
            },
            {
                id: 57,
                question: "Which type of ServiceNow script runs on the web browser?",
                options: [
                    "Client script",
                    "Server script",
                    "Local script",
                    "Database script"
                ],
                answer: [0],
                explanation: "Scripts that execute locally within the user's web browser are called Client Scripts (this also includes UI Policies). They are used to make real-time changes to forms, like hiding fields or validating data before the form is submitted.",
                multi: false
            },
            {
                id: 58,
                question: "What are best practices regarding users/groups/roles? (Select 2 answers)",
                options: [
                    "You should never assign roles to groups.",
                    "You should add users to groups.",
                    "You should assign roles to users.",
                    "You should assign roles to groups."
                ],
                answer: [1, 3],
                explanation: "The golden rule of ServiceNow security administration is: Assign roles to groups, then add users to those groups. You should generally avoid assigning roles directly to individual users, as it makes auditing and access removal incredibly tedious when an employee changes departments or leaves the company.",
                multi: true
            },
            {
                id: 59,
                question: "Virtual agent capabilities include which three of the following?",
                options: [
                    "Translating conversations",
                    "Providing tutorial ('how to') information",
                    "Answering FAQs",
                    "Performing diagnostics",
                    "Elevated role functions"
                ],
                answer: [1, 2, 3],
                explanation: "The Virtual Agent is a conversational chatbot designed for Tier 1 support deflection. Its core capabilities are guiding users through tutorials, searching the Knowledge Base to answer FAQs, and running basic diagnostic scripts (like checking if a server is up or resetting a password). It is explicitly not designed to handle high-security, elevated role functions.",
                multi: true
            },
            {
                id: 60,
                question: "Where can Admins check which release is running on an ServiceNow instance?",
                options: [
                    "system.upgraded table",
                    "Memory Stats module",
                    "Stats module",
                    "Transactions log"
                ],
                answer: [2],
                explanation: "Administrators can navigate to System Diagnostics > Stats > Stats (or simply type stats.do in the application navigator) to open a read-only page that displays critical instance information, including the exact build name, release version (e.g., Zurich, Washington DC), and current patch level.",
                multi: false
            }
            // ── More questions will be added here ──
        ]
    },
    4: {
        name: "Practice Test 4",
        total: 60,
        questions: [
            // ── Q1–Q10 ──
            {
                id: 1,
                question: "The customer has asked that you change the default layout of the Task list. They would like these columns, in this order:\n\nNumber\nTask Type\nParent\nShort Description\nAssignment Group\nAssigned to\nUpdated",
                options: [
                    "Right click List Gear icon > Configure > Columns",
                    "Click List Context Menu > Configure > Columns",
                    "Click List Context Menu > Personalize List",
                    "Right click on any column header, Context Menu > Configure > List Layout"
                ],
                answer: [3],
                explanation: "When you need to change the default layout for all users, you must use the 'Configure > List Layout' option (which requires administrative roles). If you simply clicked the Gear icon ('Personalize List'), it would only change the view for you, not the default view for the customer.",
                multi: false
            },
            {
                id: 2,
                question: "A customer has asked for the following updates to a form:\n\nMake Resolution code Mandatory, when state is changed to Resolved\nHide Major Incident check box, unless logged in user has Major Incident Manager role\n\nWhat type of rule(s) would you use to implement this requirement?",
                options: [
                    "UI Policy",
                    "Dictionary Design",
                    "UI Design",
                    "Business Rule",
                    "Form Constraint"
                ],
                answer: [0],
                explanation: "A UI Policy is the standard, best-practice tool used to dynamically change information on a form without writing complex code. It allows you to set fields to be mandatory, read-only, or hidden based on specific conditions (like the State changing) or user roles.",
                multi: false
            },
            {
                id: 3,
                question: "The baseline Service Catalog homepage contains links to which of the following components?",
                options: [
                    "Order Guides, Catalog Items, and flows",
                    "Order Guides, Item Variables, and flows",
                    "Record Producers, Order Guides, and Item Variables",
                    "Record Producers, Order Guides, and Catalog Items"
                ],
                answer: [3],
                explanation: "The Service Catalog is the primary storefront for users. From the homepage, they interact with three main things: Catalog Items (ordering a specific good or service, like a phone), Order Guides (ordering a bundled group of items, like for a new hire), and Record Producers (logging a task-based ticket, like reporting a broken printer).",
                multi: false
            },
            {
                id: 4,
                question: "At what levels can User Criteria be used in Knowledge Management to control who can read and contribute? (Select 3 answers)",
                options: [
                    "Knowledge Base",
                    "Knowledge Block",
                    "Knowledge Category",
                    "Knowledge Article"
                ],
                answer: [0, 1, 3],
                explanation: "User Criteria define who has access to view or edit content. You can apply these security rules broadly across an entire Knowledge Base, individually to a single Knowledge Article, or dynamically to reusable snippets of text placed inside articles, known as Knowledge Blocks. You cannot apply User Criteria at the Category level.",
                multi: true
            },
            {
                id: 5,
                question: "Which of the following statements describes how data is organized in a table?",
                options: [
                    "A column contains data from one user and a record is one set of fields",
                    "A column is one field and a record is one column",
                    "A column is a field in the database and a record is one user",
                    "A column is one field and a record is one row"
                ],
                answer: [3],
                explanation: "ServiceNow uses a relational database. Think of it like a standard spreadsheet. A record is an entire row of data representing one discrete item (like one Incident). A column represents one specific field of data across all records (like the 'Priority' field).",
                multi: false
            },
            {
                id: 6,
                question: "The Employee On-boarding team has asked for a way for managers to order computers, monitors, business cards, and cell phones for new employees. How would you proceed to meet this requirement?",
                options: [
                    "Create Requested Item",
                    "Create On-boarding Bot",
                    "Create Order Guide",
                    "Create Record Producer"
                ],
                answer: [2],
                explanation: "An Order Guide provides a unified, guided experience for ordering multiple related catalog items at once. Instead of a manager having to separately order a laptop, then a phone, then business cards, the Order Guide bundles them into one simple checkout flow based on the new employee's needs.",
                multi: false
            },
            {
                id: 7,
                question: "What automatically assigns tasks to users or groups?",
                options: [
                    "Assignment Rules",
                    "Assignment Handler",
                    "Auto Complete",
                    "On-Call Service"
                ],
                answer: [0],
                explanation: "Assignment Rules are predefined logic configurations that tell the system where to send a ticket automatically. For example, you can create a rule that says: 'If the Category is \"Software\", automatically assign the ticket to the \"Software Support\" group.'",
                multi: false
            },
            {
                id: 8,
                question: "Which script runs when a record is displayed, inserted, updated, deleted, or when a table is queried?",
                options: [
                    "ACL",
                    "Script Include",
                    "UI Script",
                    "Business Rule",
                    "Client Script"
                ],
                answer: [3],
                explanation: "Business Rules are server-side scripts explicitly tied to database operations. They trigger before or after specific actions occur in the database, such as querying a table to display a list, or inserting/updating a specific record.",
                multi: false
            },
            {
                id: 9,
                question: "What is the language used for scripting in ServiceNow?",
                options: [
                    "PHP",
                    "C++",
                    "Java",
                    "JavaScript"
                ],
                answer: [3],
                explanation: "While you might be more familiar with coding in C++ or Python, ServiceNow relies entirely on JavaScript for custom development. This applies to both client-side scripts (running in the browser) and server-side scripts (running in the database engine).",
                multi: false
            },
            {
                id: 10,
                question: "Which ServiceNow capability allows you to provide knowledge articles, via a conversational messaging interface?",
                options: [
                    "Virtual Agent",
                    "Agent Assist",
                    "Now Messenger",
                    "Connect Agent"
                ],
                answer: [0],
                explanation: "The Virtual Agent is ServiceNow's automated chatbot. It lives on the Service Portal and allows users to have conversational interactions to quickly find Knowledge Articles, check ticket statuses, or reset passwords without waiting for human IT support.",
                multi: false
            },
            // ── Q11–Q20 ──
            {
                id: 11,
                question: "As administrator, what must you do to access features of High Security Settings?",
                options: [
                    "Select Elevate Roles",
                    "Add security_admin role to your user account",
                    "Impersonate Security Admin",
                    "Use System Administration > Elevate Roles module"
                ],
                answer: [0],
                explanation: "To access high-security features (like creating or modifying Access Control Lists), having the security_admin role assigned to your account isn't enough on its own. You must actively click your user profile menu in the banner frame and select Elevate Roles to temporarily activate those high-security privileges for your current session.",
                multi: false
            },
            {
                id: 12,
                question: "Groups are stored in what table?",
                options: [
                    "Group [sn_sys_user_group]",
                    "Groups [sys_user_groups]",
                    "User Group [user_groups]",
                    "Group [sys_user_group]",
                    "User Groups [sn_user_groups]"
                ],
                answer: [3],
                explanation: "In ServiceNow, the core foundational tables dealing with users generally use the sys_user prefix. The specific table that stores all group records is the singular sys_user_group table.",
                multi: false
            },
            {
                id: 13,
                question: "When a custom table is created, which access control rules are automatically created? (Select 4 answers)",
                options: [
                    "update",
                    "write",
                    "execute",
                    "read",
                    "create",
                    "delete"
                ],
                answer: [1, 3, 4, 5],
                explanation: "When you create a new custom table and check the option to 'Create access controls' (which is best practice), ServiceNow automatically generates the four fundamental CRUD security rules for that table: Create, Read, Write (which acts as update), and Delete.",
                multi: true
            },
            {
                id: 14,
                question: "What is the definition of a group?",
                options: [
                    "An escalation pod",
                    "A department",
                    "A collection of subject matter experts",
                    "A collection of tasks",
                    "A collection of users"
                ],
                answer: [4],
                explanation: "In platform terminology, a Group is fundamentally just a collection of users who share a common purpose. While a group could be used to represent a department or an escalation pod in your business structure, the technical definition is strictly a collection of user records.",
                multi: false
            },
            {
                id: 15,
                question: "User records are stored in which table?",
                options: [
                    "Users [sys_users]",
                    "User [sys_user]",
                    "User [u_user]",
                    "User [sn_user]"
                ],
                answer: [1],
                explanation: "Every individual user profile in the system is stored as a single record within the core, out-of-the-box sys_user table.",
                multi: false
            },
            {
                id: 16,
                question: "Which tool is used to define relationships between fields in an import set table and a target table?",
                options: [
                    "Schema Map",
                    "Transform Schema",
                    "Field Transformer",
                    "Transform Map"
                ],
                answer: [3],
                explanation: "When importing data, the Transform Map acts as the translator. It tells the system exactly how to take the data sitting in the temporary staging area (the import set table) and map it to the correct, permanent fields in the final destination (the target table).",
                multi: false
            },
            {
                id: 17,
                question: "What section on a task record would you use to see the most recent update made to a record?",
                options: [
                    "Timeline",
                    "Activity",
                    "Audit Log",
                    "Journal"
                ],
                answer: [1],
                explanation: "The Activity section (often called the Activity Stream) is located at the bottom of standard task forms. It provides a real-time, chronological feed of all changes made to the record, including who made the change, when it happened, and any comments or work notes added.",
                multi: false
            },
            {
                id: 18,
                question: "A record is added to which table each time a knowledge article is viewed?",
                options: [
                    "Knowledge Feedback [kb_feedback]",
                    "Knowledge Use [kb_use]",
                    "Knowledge Search Log [ts_query_kb]",
                    "Knowledge [kb_knowledge]"
                ],
                answer: [1],
                explanation: "To help organizations track the popularity and effectiveness of their documentation, ServiceNow generates a log entry in the kb_use table every single time an end-user opens and views a Knowledge Article.",
                multi: false
            },
            {
                id: 19,
                question: "When managing tags, you can adjust who is able to see it. What are the visibility options? (Select 3 answers)",
                options: [
                    "Groups and Users",
                    "Everyone",
                    "Me",
                    "Roles and Permissions",
                    "Admin"
                ],
                answer: [0, 1, 2],
                explanation: "Tags are used to group and organize records (like flagging three different Incidents as 'Project Alpha'). When you create a tag, you can restrict its visibility to just yourself (Me), share it with specific teams (Groups and Users), or make it public for the whole instance (Everyone).",
                multi: true
            },
            {
                id: 20,
                question: "How are products and services in the Service Catalog organized?",
                options: [
                    "Categories and Subcategories",
                    "Tickets and Requests",
                    "Incidents and Problems",
                    "Tasks and Subtasks"
                ],
                answer: [0],
                explanation: "The Service Catalog is designed to feel like an e-commerce shopping experience. To make items easy to find, they are structured hierarchically into Categories (e.g., 'Hardware') and further broken down into Subcategories (e.g., 'Laptops', 'Mobile Phones').",
                multi: false
            },
            // ── Q21–Q30 ──
            {
                id: 21,
                question: "What is generated from the Service Catalog once a user places an order for an item or service?",
                options: [
                    "A change request",
                    "A request",
                    "A catalog task",
                    "An Order Guide"
                ],
                answer: [1],
                explanation: "Placing an order creates the overarching Request (REQ) record.",
                multi: false
            },
            {
                id: 22,
                question: "The Report Designer contains different sections for configuring your report. Which section is used to adjust the look of your report, including colors, titles and legend layout?",
                options: [
                    "Layout",
                    "Style",
                    "Configure",
                    "Format"
                ],
                answer: [1],
                explanation: "The Style tab is the final step for visual tweaking in the designer workflow.",
                multi: false
            },
            {
                id: 23,
                question: "You have been asked to create a way for users to order a new iPhone, but only if they get two levels of approval... What feature would you use to manage the approvals and notifications?",
                options: [
                    "Approver Delegates",
                    "Approval Chains",
                    "Flows",
                    "Parent-Child Approvers",
                    "Approval Criteria"
                ],
                answer: [2],
                explanation: "Flow Designer is used to build out multi-level approval and notification logic.",
                multi: false
            },
            {
                id: 24,
                question: "Where to click to always return back to Home?",
                options: [
                    "Star",
                    "Logo",
                    "Gear Icon",
                    "Special Arrow"
                ],
                answer: [1],
                explanation: "Clicking your company logo in the far left of the Banner Frame always routes you to your default homepage.",
                multi: false
            },
            {
                id: 25,
                question: "Which term refers to application menus and modules which you may want to access quickly and often?",
                options: [
                    "Breadcrumb",
                    "Bookmark",
                    "Favorite",
                    "Tag"
                ],
                answer: [2],
                explanation: "Represented by the Star icon in the Application Navigator.",
                multi: false
            },
            {
                id: 26,
                question: "How would you navigate to the Schema map for a table?",
                options: [
                    "System Definition > Tables; Select Table; Go to Related links and click Show Schema Map",
                    "System Definition > Dictionary; Select Table; Click Show Schema Map",
                    "System Properties > UI Properties > Show Schema Map",
                    "Right click list header > Configure > Schema Map"
                ],
                answer: [0],
                explanation: "The native UI path to visualize table architecture.",
                multi: false
            },
            {
                id: 27,
                question: "A task worker asks how they can monitor any updates occurring to records assigned to him, like responses from customers. What do you suggest?",
                options: [
                    "On My Work list, right click and select Watch",
                    "On My Work list, select the Activity Stream icon to show a frame with live updates",
                    "Open each record in a new tab and refresh",
                    "Configure an email notification for every update"
                ],
                answer: [1],
                explanation: "This provides a real-time feed without needing to open multiple individual records.",
                multi: false
            },
            {
                id: 28,
                question: "You have heard about a new application released by ServiceNow... What would be the best way to get hands-on experience with the new application?",
                options: [
                    "Activate the application plug in, on your personal dev instance",
                    "Request ServiceNow support to activate it in Production",
                    "Pay for the Premium Application sandbox",
                    "Search the ServiceNow community for a demo video"
                ],
                answer: [0],
                explanation: "Personal Developer Instances (PDIs) are free environments meant for safe, sandbox testing.",
                multi: false
            },
            {
                id: 29,
                question: "What will happen if you click 'Show Matching' on the 'Software' category on the incident list?",
                options: [
                    "All incidents with Software category will be hidden",
                    "All incidents with Software category will remain visible",
                    "An error message will show up",
                    "A new Software incident will be created"
                ],
                answer: [1],
                explanation: "It filters the active list to exclusively display records containing that specific value.",
                multi: false
            },
            {
                id: 30,
                question: "What is the path an Administrator could take to view the fulfillment stage task list for an order placed by a user?",
                options: [
                    "TASK (Number)>REQ (Number)>RITM (Number)",
                    "RITM (Number)>REQ (Number)>TASK (Number)",
                    "REQ (Number)>RITM (Number)>TASK (Number)",
                    "REQ (Number)>TASK (Number)>RITM (Number)"
                ],
                answer: [2],
                explanation: "This is the standard hierarchical breakdown of a Service Catalog order from top to bottom.",
                multi: false
            },
            // ── Q31–Q40 ──
            {
                id: 31,
                question: "What role enables someone to authorize a request, with no other permissions on the platform?",
                options: [
                    "Reviewer [reviewer_user]",
                    "Approval Group [approval_group]",
                    "Approver [approver_user]",
                    "Authorize [authorize_user]",
                    "Verification [verify_user]"
                ],
                answer: [2],
                explanation: "The approver_user role is a 'light' license role. It allows users to perform only one primary function: viewing and approving requests assigned to them. It does not grant access to modules like Incident, Problem, or Change for fulfillment purposes.",
                multi: false
            },
            {
                id: 32,
                question: "What feature do you use to specify which users are able to access a Service Catalog Item?",
                options: [
                    "Can Read Role",
                    "Catalog User Role",
                    "User Criteria",
                    "Can Order Tab"
                ],
                answer: [2],
                explanation: "User Criteria is the standard security mechanism for the Service Catalog. It allows administrators to define groups based on department, location, or role and then apply them to the 'Available For' or 'Not Available For' lists on items or categories.",
                multi: false
            },
            {
                id: 33,
                question: "Access Control rules may provide access security for which of the following database objects?",
                options: [
                    "For specific groups",
                    "For a specific role, group, or user",
                    "For a specific row, column, or table",
                    "For a specific CMDB Configuration item"
                ],
                answer: [2],
                explanation: "Access Control Lists (ACLs) secure the data layer. You can restrict an entire table (the object), a specific column (the field), or a specific row (the individual record) using conditions and scripts.",
                multi: false
            },
            {
                id: 34,
                question: "For Administrators creating new Service Catalog items, what is a characteristic they should know about Service Catalog variables?",
                options: [
                    "Service Catalog variables cannot affect the order price",
                    "Service Catalog variables can only be used in Order Guides",
                    "Service Catalog variables are global by default",
                    "Service Catalog variables can only be used in Record Producers"
                ],
                answer: [2],
                explanation: "Variables in the Service Catalog are global, meaning that unless hidden by UI Policies, they remain visible and available throughout the fulfillment process (from the initial request to the Requested Item and Catalog Task).",
                multi: false
            },
            {
                id: 35,
                question: "Many actions are included with flow designer, what are some frequently used core actions? (Select 4 answers)",
                options: [
                    "Create Record",
                    "Wait for Condition",
                    "Look for Update",
                    "Look Up Record",
                    "Wait for Match",
                    "Ask for Approval"
                ],
                answer: [0, 1, 3, 5],
                explanation: "Core actions are the out-of-the-box operations provided by ServiceNow. 'Create', 'Wait for Condition', 'Look Up', and 'Ask for Approval' are essential building blocks for automating business processes in Flow Designer.",
                multi: true
            },
            {
                id: 36,
                question: "Table Access Control rules are processed in the following order:",
                options: [
                    "any table name (wildcard), table name, parent table name",
                    "any table name (wildcard), parent table name, table name",
                    "table name, parent table name, any table name (wildcard)",
                    "parent table name, table name, any table name (wildcard)"
                ],
                answer: [2],
                explanation: "Security follows a 'Specific to General' hierarchy. The system first checks for an ACL on the specific Table, then its Parent, and finally the Wildcard (*) which applies to all tables.",
                multi: false
            },
            {
                id: 37,
                question: "On the Form header, which element you use to access form templates?",
                options: [
                    "More Options (...)",
                    "Pages",
                    "Paperclip",
                    "Stamp"
                ],
                answer: [0],
                explanation: "The 'More Options' menu (the three dots) contains the 'Toggle Template Bar' action, which allows users to apply pre-configured data to a form instantly.",
                multi: false
            },
            {
                id: 38,
                question: "What type of client script runs when a cell on a list changes value through use of the List editor?",
                options: [
                    "onListEdit()",
                    "onCellEdit()",
                    "onChange()",
                    "onEdit()"
                ],
                answer: [1],
                explanation: "onCellEdit() is the specific script type for list views. While onChange() handles single field changes on a form, onCellEdit() monitors and responds to changes made directly within a list cell.",
                multi: false
            },
            {
                id: 39,
                question: "Security rules are defined to restrict the permissions of users from viewing and interacting with data. What are these security rules called?",
                options: [
                    "Role Assignment Rules",
                    "CRUD Rules",
                    "Scripted User Rules",
                    "Access Control Rules"
                ],
                answer: [3],
                explanation: "In ServiceNow, the primary security mechanism is the Access Control Rule (ACL). While these rules often define CRUD (Create, Read, Update, Delete) permissions, the feature name itself is Access Control.",
                multi: false
            },
            {
                id: 40,
                question: "What Service Catalog feature do you use to organize catalog items into logical groups?",
                options: [
                    "Sections",
                    "Variable Sets",
                    "Categories",
                    "Catalog items Group"
                ],
                answer: [2],
                explanation: "Categories provide the folder-like structure for the Service Catalog. For example, 'Hardware' and 'Software' are categories used to group specific items so users can find them easily.",
                multi: false
            },
            // ── Q41–Q50 ──
            {
                id: 41,
                question: "When searching using the App Navigator search field, what can be returned? (Select 4 answers)",
                options: [
                    "Names of Applications",
                    "Titles of Dashboard Gauges",
                    "History Records",
                    "Names of Applications and Modules",
                    "Favorites",
                    "Names of Modules"
                ],
                answer: [0, 3, 4, 5],
                explanation: "The filter navigator allows you to quickly find items within the navigation pane. It searches across application labels, module labels, and your personal favorites.",
                multi: true
            },
            {
                id: 42,
                question: "What setting allows users to view a Knowledge Base article even if they are not logged in?",
                options: [
                    "The Global setting",
                    "The Open setting",
                    "The Public setting",
                    "The External setting"
                ],
                answer: [2],
                explanation: "To make a Knowledge article visible to unauthenticated users, the article or the Knowledge Base must be set to 'Public.' This bypasses the standard login requirement for viewing.",
                multi: false
            },
            {
                id: 43,
                question: "What happens if you select Publish when creating articles manually or by import?",
                options: [
                    "The article is immediately visible to all users",
                    "It triggers the publish workflow assigned to the knowledge base",
                    "The article is sent to a manager for review",
                    "The article is saved as a draft"
                ],
                answer: [1],
                explanation: "Clicking 'Publish' does not always mean the article goes live immediately. Instead, it initiates the specific workflow (like 'Knowledge - Approval Publish') defined for that Knowledge Base.",
                multi: false
            },
            {
                id: 44,
                question: "What types of entities can receive task assignments, in ServiceNow? (Select 2 answers)",
                options: [
                    "Users",
                    "Groups",
                    "Teams",
                    "Departments"
                ],
                answer: [0, 1],
                explanation: "Tasks are assigned to a 'Group' (Assignment Group) first, and then typically to an individual 'User' (Assigned to) within that group.",
                multi: true
            },
            {
                id: 45,
                question: "Which mobile application is designed to interact with customer support and is not customizable?",
                options: [
                    "Now Mobile",
                    "Mobile Agent",
                    "Now Support",
                    "Virtual Agent App"
                ],
                answer: [2],
                explanation: "The Now Support (formerly HI) mobile app is provided by ServiceNow for customers to manage their own instances and cases with ServiceNow technical support. Unlike the 'Now Mobile' platform app, it is a fixed tool for support interaction.",
                multi: false
            },
            {
                id: 46,
                question: "Which field type displays records from another table?",
                options: [
                    "Choice",
                    "String",
                    "Reference",
                    "List"
                ],
                answer: [2],
                explanation: "A Reference field creates a relationship between two tables. It stores the sys_id of a record from the target table and displays a display value (like a name) to the user.",
                multi: false
            },
            {
                id: 47,
                question: "How would you distinguish between a Base Class table and a Parent Class table?",
                options: [
                    "Base Class table cannot have records, Parent class tables can",
                    "Base Class table is a system table, Parent class tables are custom",
                    "Base Class table is not extended from another table, Parent class tables may be extended from another table",
                    "Base Class table is only used for CMDB, Parent class tables are used for tasks"
                ],
                answer: [2],
                explanation: "A Base Table (like Task) is at the very top of a hierarchy and does not extend anything else. A Parent Table is simply any table that has another table extending from it (for example, Task is a parent to Incident).",
                multi: false
            },
            {
                id: 48,
                question: "What icon do you use to change the label on a Favorite?",
                options: [
                    "Star",
                    "Gear",
                    "Pencil",
                    "Wrench"
                ],
                answer: [2],
                explanation: "To edit a favorite's name, color, or icon, you click the Pencil icon located at the bottom of the Favorites tab in the Application Navigator.",
                multi: false
            },
            {
                id: 49,
                question: "How would you define an Access Control, to allow a user with itil role to have permission to create incident records?",
                options: [
                    "Name: incident; Operation: write; Role: itil",
                    "Name: incident.None; Operation: create; Role: itil",
                    "Name: incident.*; Operation: create; Role: itil",
                    "Name: incident; Operation: create; Role: itil"
                ],
                answer: [1],
                explanation: "To grant permission to the whole table (rather than a specific field), you use the [table].None syntax. The 'create' operation specifically allows the creation of new records.",
                multi: false
            },
            {
                id: 50,
                question: "What are two ways to generate an Event? (Select 2 answers)",
                options: [
                    "Client Script",
                    "Log entry",
                    "Business Rule",
                    "Workflow"
                ],
                answer: [2, 3],
                explanation: "Events are typically triggered server-side. Business Rules use gs.eventQueue() to fire events, and Workflows (or Flow Designer) have dedicated activities to generate events for notifications or processing.",
                multi: true
            },
            // ── Q51–Q60 ──
            {
                id: 51,
                question: "Which of the following steps can be used to import new data into ServiceNow from a spreadsheet?",
                options: [
                    "Define Data Source, Select Transform Map, Run Transform",
                    "Select Data Source, Schedule Transform",
                    "Select Import Set, Select Transform Map, Run Transform",
                    "Load Data, Create Transform Map, Run Transform"
                ],
                answer: [3],
                explanation: "The standard import process follows three main steps: Load Data (creates the staging import set table), Create Transform Map (maps source columns to target fields), and Run Transform (moves data into the target table).",
                multi: false
            },
            {
                id: 52,
                question: "What is the sequence of conditions in an SLA definition?",
                options: [
                    "Start, Hold, Halt",
                    "Begin, Hold, Halt",
                    "Start, In Progress, Stop",
                    "Start, Pause, Stop"
                ],
                answer: [3],
                explanation: "An SLA definition requires three main conditions to manage its clock: Start (when it begins), Pause (when the clock should stop temporarily, like 'Awaiting User'), and Stop (when the requirement is met).",
                multi: false
            },
            {
                id: 53,
                question: "Which field on a Configuration Item (CI) record may be used to route Incidents to the appropriate group to resolve CI related incidents quickly?",
                options: [
                    "Change control",
                    "Managed by",
                    "Support Group",
                    "Assignment Group"
                ],
                answer: [2],
                explanation: "The Support Group field on a CI is specifically intended to identify which team is responsible for the technical maintenance and troubleshooting of that specific item.",
                multi: false
            },
            {
                id: 54,
                question: "When importing data, what happens to imported rows, if no coalesce field is specified?",
                options: [
                    "All rows are treated as new records, but errors will be flagged in the import log.",
                    "Duplicate rows are rejected from the import.",
                    "All rows are rejected from the import, as coalesce field is required.",
                    "All rows are treated as new records. No existing records are updated."
                ],
                answer: [3],
                explanation: "Without a Coalesce field, the system has no way to check if a record already exists. Therefore, it assumes every row is unique and creates a new record for every single one.",
                multi: false
            },
            {
                id: 55,
                question: "When looking at a long list of records, you want to quickly filter, to show only those which have Short Description containing email. How might you do that?",
                options: [
                    "On Search box, select text, type email, click enter",
                    "Click List Magnifier to expand column search, on Short Description, type email, click enter",
                    "Click List Magnifier to expand column search, on Short Description, type *email, click enter",
                    "Click List Magnifier to expand column search, on Short Description, type %email, click enter"
                ],
                answer: [2],
                explanation: "In the column search, the asterisk (*) acts as a 'contains' operator. Typing *email finds any record where the word 'email' appears anywhere in that field.",
                multi: false
            },
            {
                id: 56,
                question: "How would you define an Access Control, to allow a user with itil role to have permission to create incident records?",
                options: [
                    "Name: incident; Operation: write; Role: itil",
                    "Name: incident.None; Operation: create; Role: itil",
                    "Name: incident.*; Operation: create; Role: itil",
                    "Name: incident; Operation: create; Role: itil"
                ],
                answer: [1],
                explanation: "To grant permission to the whole table (rather than a specific field), you use the [table].None syntax. The 'create' operation specifically allows the creation of new records.",
                multi: false
            },
            {
                id: 57,
                question: "In this example [Companies: ACME North America; Departments: HR; Groups: ACME Managers; Match All: Yes], what users would have access to this knowledge base?",
                options: [
                    "Members of the ACME Manager group, who are also members of HR Department and part of ACME North America",
                    "Members of the ACME Managers group, and HR department, regardless of geography",
                    "Any user who is a member of the ACME Manager group, OR HR Department, OR part of ACME North America",
                    "Only the system administrator"
                ],
                answer: [0],
                explanation: "When Match All is set to Yes, the user must meet every single condition listed in the criteria. It acts as an 'AND' logic.",
                multi: false
            },
            {
                id: 58,
                question: "What creates a new record and keeps the form open?",
                options: [
                    "Save",
                    "Insert and Stay",
                    "Update",
                    "Insert"
                ],
                answer: [1],
                explanation: "Insert creates a record and returns to the list. Insert and Stay creates the new record and keeps you on that same record page so you can continue working.",
                multi: false
            },
            {
                id: 59,
                question: "Which component of a table contains a piece of data for one record?",
                options: [
                    "Table",
                    "Field",
                    "Factor",
                    "Datapoint",
                    "Element"
                ],
                answer: [1],
                explanation: "In a database table, a Field is the intersection of a row and a column representing a single piece of information (like a name or a date).",
                multi: false
            },
            {
                id: 60,
                question: "Which of the following is NOT a database setting on the Application Access section of a Table?",
                options: [
                    "Can read",
                    "Can update",
                    "Can delete",
                    "Can write",
                    "Can create"
                ],
                answer: [3],
                explanation: "In the Application Access section, the options are 'Can read', 'Can create', 'Can update', and 'Can delete'. While 'write' is a common operation name in ACLs, it is not the label used for the checkbox in the Application Access configuration.",
                multi: false
            }
        ]
    },
    5: {
        name: "Practice Test 5",
        total: 60,
        questions: [
            {
                id: 1,
                question: "What do you configure to instruct fields how to behave on a form when a UI policy is triggered?",
                options: [
                    "UI Actions",
                    "Client Script",
                    "UI Policy Action",
                    "Data Policy"
                ],
                answer: [2],
                explanation: "UI Policy Actions define how fields behave (mandatory, visible, read-only) when a UI Policy condition is met.",
                multi: false
            },
            {
                id: 2,
                question: "Which are ways to add favourites in Next Experience? (Select 3)",
                options: [
                    "Personalisation gear icon",
                    "Star icon in contextual app pill",
                    "Heart icon in KB article",
                    "Create Favorite from context menu",
                    "Star icon in All menu"
                ],
                answer: [1, 3, 4],
                explanation: "Favorites can be added using star icons or context menu options in Next Experience UI.",
                multi: true
            },
            {
                id: 3,
                question: "What icon marks fields that provide AI recommendations?",
                options: [
                    "Sparkle icon",
                    "Information icon",
                    "Star icon",
                    "Robot icon"
                ],
                answer: [0],
                explanation: "Sparkle icon indicates AI-generated recommendations or auto-filled suggestions.",
                multi: false
            },
            {
                id: 4,
                question: "Where do you navigate to build reports?",
                options: [
                    "Reports > Getting Started",
                    "Service Catalog > Request Reports",
                    "Reports > Create New",
                    "Performance Analytics > Create Reports",
                    "Resource > Resource Reports"
                ],
                answer: [2],
                explanation: "Reports are created directly from Reports → Create New.",
                multi: false
            },
            {
                id: 5,
                question: "Which application centralizes creating and managing knowledge?",
                options: [
                    "Configuration Management",
                    "Knowledge Management",
                    "Performance Analytics",
                    "Data Separation"
                ],
                answer: [1],
                explanation: "Knowledge Management provides a central place to create, categorize, and manage knowledge articles.",
                multi: false
            },
            {
                id: 6,
                question: "Which field type is Boolean and displays as a checkbox?",
                options: [
                    "Yes/No",
                    "On/Off",
                    "Positive/Negative",
                    "0/1",
                    "Checked/Unchecked",
                    "True/False"
                ],
                answer: [5],
                explanation: "Boolean fields (True/False) appear as checkboxes in forms.",
                multi: false
            },
            {
                id: 7,
                question: "Which related list tracks groups assigned to a CI?",
                options: [
                    "CMDB Alert Groups",
                    "Dynamic CI Group",
                    "Teams",
                    "Resource Group"
                ],
                answer: [2],
                explanation: "The Teams related list tracks different group types assigned to a CI, like support and change groups.",
                multi: false
            },
            {
                id: 8,
                question: "What is created when a catalog item is ordered? (Select 3)",
                options: [
                    "SCTASK",
                    "Variable Set",
                    "RITM",
                    "Variable",
                    "REQ"
                ],
                answer: [0, 2, 4],
                explanation: "Ordering a catalog item creates a hierarchy: Request (REQ) → Requested Item (RITM) → Service Catalog Task (SCTASK).",
                multi: true
            },
            {
                id: 9,
                question: "When can you view SEO recommendations?",
                options: [
                    "Rating/commenting",
                    "Flagging article",
                    "Attaching to incident",
                    "Editing/publishing article",
                    "Viewing on portal"
                ],
                answer: [3],
                explanation: "SEO suggestions appear during article editing or publishing to improve article discoverability.",
                multi: false
            },
            {
                id: 10,
                question: "CMDB is authoritative for what? (Select 3)",
                options: [
                    "Contact",
                    "Server logs",
                    "Support group",
                    "Config file contents",
                    "Owner"
                ],
                answer: [0, 2, 4],
                explanation: "CMDB stores ownership and support-related metadata (Contact, Support group, Owner), not logs or file contents.",
                multi: true
            },
            {
                id: 11,
                question: "Which menu provides options like saving, configuring, and favorites?",
                options: [
                    "Form Context Menu",
                    "Form Layout Menu",
                    "Form Personalisation Menu",
                    "Form Column Menu"
                ],
                answer: [0],
                explanation: "The Form Context Menu, accessible via the three-bar icon or right-click on the form header, provides options like saving, configuring, and adding favorites.",
                multi: false
            },
            {
                id: 12,
                question: "What is a Configuration Item (CI)?",
                options: [
                    "Info describing CI",
                    "Set of tools/database",
                    "Database storing records",
                    "Components required to deliver service"
                ],
                answer: [3],
                explanation: "CIs are the infrastructure components (hardware, software, services) required to deliver an IT service.",
                multi: false
            },
            {
                id: 13,
                question: "Default ACLs for a custom table? (Select 4)",
                options: [
                    "Delete",
                    "Archive",
                    "Write",
                    "Read",
                    "Access",
                    "Create"
                ],
                answer: [0, 2, 3, 5],
                explanation: "When a custom table is created, four ACLs are auto-generated: Create, Read, Write, and Delete.",
                multi: true
            },
            {
                id: 14,
                question: "Which catalog item type creates incidents or HR cases?",
                options: [
                    "Order an item",
                    "Record producer",
                    "Request a service",
                    "Maintain a service"
                ],
                answer: [1],
                explanation: "Record producers are catalog items that create task-based records like incidents or HR cases when submitted.",
                multi: false
            },
            {
                id: 15,
                question: "Main sections in email notifications? (Select 3)",
                options: [
                    "What it will contain",
                    "How often to send",
                    "Who will receive",
                    "How to respond",
                    "When to send"
                ],
                answer: [0, 2, 4],
                explanation: "A ServiceNow notification is configured in three sections: What it will contain (message body), Who will receive (recipients), and When to send (trigger condition).",
                multi: true
            },
            {
                id: 16,
                question: "Which CMDB table stores basic CI attributes?",
                options: [
                    "cmdb_ci",
                    "cmdb_ci_config_file",
                    "cmdb",
                    "cmdb_rel_ci"
                ],
                answer: [0],
                explanation: "The cmdb_ci table is the base table that stores core attributes for all Configuration Items.",
                multi: false
            },
            {
                id: 17,
                question: "Which app helps draft knowledge articles using AI?",
                options: [
                    "Now Assist",
                    "Knowledge Creator",
                    "Knowledge Manager",
                    "Knowledge Assist"
                ],
                answer: [0],
                explanation: "Now Assist uses generative AI to help authors draft, summarize, and manage knowledge articles.",
                multi: false
            },
            {
                id: 18,
                question: "What do records and fields correspond to in a database?",
                options: [
                    "Record = row, Field = column",
                    "Record & field = row",
                    "Record & field = column",
                    "Record = column, Field = row"
                ],
                answer: [0],
                explanation: "In a database table, a record is a row (one entity) and a field is a column (one attribute).",
                multi: false
            },
            {
                id: 19,
                question: "Tier 2 tasks virtual agents perform? (Select 3)",
                options: [
                    "Impersonating users",
                    "Performing diagnostics",
                    "Providing how-to info",
                    "Answering FAQs"
                ],
                answer: [1, 2, 3],
                explanation: "Virtual agents handle Tier 2 tasks such as answering FAQs, providing how-to information, and performing diagnostics.",
                multi: true
            },
            {
                id: 20,
                question: "Customer responsibility in the Shared Responsibility Model?",
                options: [
                    "Disaster recovery",
                    "Infrastructure management",
                    "Authentication & authorization",
                    "Backup restoration"
                ],
                answer: [2],
                explanation: "In the Shared Responsibility Model, the customer manages access control, roles, and authentication/authorization setup.",
                multi: false
            },
            {
                id: 21,
                question: "What replaced Core UI Reporting and Dashboards?",
                options: [
                    "Process Mining",
                    "Platform Analytics",
                    "User Experience Analytics",
                    "Performance Analytics"
                ],
                answer: [1],
                explanation: "Platform Analytics replaced Core UI Reporting and Dashboards. It provides data visualizations, dashboards, KPI tracking, and unified analytics across multiple data sources.",
                multi: false
            },
            {
                id: 22,
                question: "Which CMDB feature tracks data source activity? (Select 2)",
                options: [
                    "Multisource CMDB",
                    "CI Class Manager",
                    "CMDB 360",
                    "CMDB Data Manager",
                    "CI Lifecycle Management"
                ],
                answer: [0, 2],
                explanation: "Multisource CMDB and CMDB 360 together provide visibility into data source history, CI updates, and discovery tracking across multiple data sources.",
                multi: true
            },
            {
                id: 23,
                question: "Which statements about Flow Designer actions are true? (Select 3)",
                options: [
                    "Reusable operations",
                    "Custom actions can be created",
                    "Contained in a spoke",
                    "Require scripting",
                    "Define the flow trigger"
                ],
                answer: [0, 1, 2],
                explanation: "Flow Designer actions are reusable logic blocks contained in spokes. Custom actions can be created without scripting (low-code). Actions do not define the trigger — triggers are separate components.",
                multi: true
            },
            {
                id: 24,
                question: "Schema relationship types? (Select 4)",
                options: [
                    "Extending",
                    "Referencing",
                    "Extended by",
                    "Referenced by",
                    "Contained by"
                ],
                answer: [0, 1, 2, 3],
                explanation: "The four schema relationship types are: Extending (inheritance), Extended by (reverse inheritance), Referencing (foreign key), and Referenced by (reverse foreign key reference).",
                multi: true
            },
            {
                id: 25,
                question: "Report types available from list view? (Select 2)",
                options: [
                    "Pie chart",
                    "Trend chart",
                    "Bar chart",
                    "Heatmap",
                    "Gauge"
                ],
                answer: [0, 2],
                explanation: "From the list view, you can quickly create simple aggregate reports like Pie charts and Bar charts by right-clicking a column header.",
                multi: true
            },
            {
                id: 26,
                question: "Fulfillment process options in Service Catalog? (Select 3)",
                options: [
                    "Flow",
                    "Workflow",
                    "Execution Plan",
                    "Business Rule",
                    "Script Include"
                ],
                answer: [0, 1, 2],
                explanation: "All three define catalog fulfillment logic: Flow (modern, recommended), Workflow (legacy), and Execution Plan (linear task execution).",
                multi: true
            },
            {
                id: 27,
                question: "Which ACL operation controls access to reports?",
                options: [
                    "execute",
                    "read",
                    "add_to_list",
                    "report_view"
                ],
                answer: [3],
                explanation: "The report_view ACL operation specifically controls who can access and view reports. It works at the table and field level and is more targeted than the general read ACL.",
                multi: false
            },
            {
                id: 28,
                question: "Types of Flow Designer triggers? (Select 3)",
                options: [
                    "Record-based",
                    "Application-based",
                    "Schedule-based",
                    "User-based",
                    "Role-based"
                ],
                answer: [0, 1, 2],
                explanation: "Flow triggers define when a flow runs: Record-based (when data changes), Schedule-based (time-based), and Application-based (external or system events).",
                multi: true
            },
            {
                id: 29,
                question: "Decision types in an ACL rule? (Select 2)",
                options: [
                    "Allow If",
                    "Deny Unless",
                    "Permit When",
                    "Restrict If",
                    "Block Unless"
                ],
                answer: [0, 1],
                explanation: "ACL decision types are Allow If (allow when conditions are met) and Deny Unless (deny access unless conditions are met). Deny Unless has higher priority.",
                multi: true
            },
            {
                id: 30,
                question: "What happens when a Data Policy restriction is applied to a field in list view?",
                options: [
                    "The field is hidden from the list",
                    "The field appears editable, but the update fails upon saving",
                    "The field is immediately locked and greyed out",
                    "The user receives an error before editing"
                ],
                answer: [1],
                explanation: "Data Policies work server-side. The UI still shows the field as editable in list view, but when the user tries to save, the update is rejected due to the restriction.",
                multi: false
            },
            {
                id: 31,
                question: "Where do you go to impersonate a user?",
                options: [
                    "Admin panel",
                    "System Security > Impersonation",
                    "User menu (top-right)",
                    "Profile settings"
                ],
                answer: [2],
                explanation: "To impersonate a user, click the User menu (top-right corner) and select 'Impersonate User'. This requires the impersonator role.",
                multi: false
            },
            {
                id: 32,
                question: "Which tab on an incident form contains the Activity Stream?",
                options: [
                    "Related Links",
                    "Notes",
                    "Work Detail",
                    "Activity"
                ],
                answer: [1],
                explanation: "The Activity Stream, which shows comments and work notes on a record, is always found in the Notes tab on forms.",
                multi: false
            },
            {
                id: 33,
                question: "What is the relationship between the Problem table and the Task table?",
                options: [
                    "Problem table references Task table",
                    "Task table extends Problem table",
                    "Problem table extends Task table",
                    "They are independent tables"
                ],
                answer: [2],
                explanation: "Problem extends the Task base table. Incident and Change Request also extend Task, providing shared fields like assignment group and state.",
                multi: false
            },
            {
                id: 34,
                question: "Which CMDB feature provides hierarchical CI relationship visualization?",
                options: [
                    "CI Class Manager",
                    "Dependency View",
                    "Unified Map",
                    "Service Mapping"
                ],
                answer: [2],
                explanation: "The Unified Map shows CI relationships visually, combining dependency views and service mapping. It is used in CMDB Workspace.",
                multi: false
            },
            {
                id: 35,
                question: "Where do you navigate to view email notifications in ServiceNow?",
                options: [
                    "System Properties > Email",
                    "System Notification > Email > Notifications",
                    "System Admin > Notifications",
                    "Email Settings > Notification Log"
                ],
                answer: [1],
                explanation: "Email notifications are found under System Notification → Email → Notifications in the ServiceNow navigation.",
                multi: false
            },
            {
                id: 36,
                question: "Ways to give feedback on a knowledge article? (Select 3)",
                options: [
                    "Leave a comment",
                    "Flag the article",
                    "1-5 star rating",
                    "Mark helpful / not helpful",
                    "Share on portal"
                ],
                answer: [0, 2, 3],
                explanation: "Users can give feedback on knowledge articles by leaving a comment, giving a 1–5 star rating, or marking the article as helpful or not helpful.",
                multi: true
            },
            {
                id: 37,
                question: "Which type of Visual Task Board automatically updates associated task records?",
                options: [
                    "Flexible",
                    "Freeform",
                    "Guided",
                    "Custom"
                ],
                answer: [2],
                explanation: "A Guided Visual Task Board is connected to real records and automatically updates them when cards are moved. Flexible and Freeform boards do not push updates to underlying data.",
                multi: false
            },
            {
                id: 38,
                question: "Which is an example of a base table in ServiceNow?",
                options: [
                    "Incident [incident]",
                    "Task [task]",
                    "Change Request [change_request]",
                    "Problem [problem]"
                ],
                answer: [1],
                explanation: "Task [task] is the base table. Incident, Change Request, and Problem all extend Task, inheriting its core fields.",
                multi: false
            },
            {
                id: 39,
                question: "What feature in Workspace enables group discussion on a record?",
                options: [
                    "Activity Stream",
                    "Connected Chat",
                    "Sidebar",
                    "Collaboration panel"
                ],
                answer: [2],
                explanation: "The Sidebar in ServiceNow Workspace allows team members to have group discussions on a record in real time.",
                multi: false
            },
            {
                id: 40,
                question: "What enables Flow Designer to call third-party systems?",
                options: [
                    "Business Rules",
                    "Integration Hub",
                    "Script Includes",
                    "Transform Maps"
                ],
                answer: [1],
                explanation: "Integration Hub enables REST, SOAP, and PowerShell integrations with third-party systems. It uses prebuilt spokes and can work with a MID Server for on-premises systems.",
                multi: false
            },
            {
                id: 41,
                question: "Who can add visual elements to an inline dashboard? (Select 3)",
                options: [
                    "Users with dashboard_admin role",
                    "Users with viz_admin role",
                    "Users with edit access to the dashboard",
                    "Dashboard owner",
                    "Any authenticated user"
                ],
                answer: [0, 2, 3],
                explanation: "Only users with the dashboard_admin role, edit access to the dashboard, or the dashboard owner can add or modify visual elements on an inline dashboard.",
                multi: true
            },
            {
                id: 42,
                question: "Which role is required to modify ACL rules?",
                options: [
                    "admin",
                    "itil_admin",
                    "security_admin",
                    "acl_manager"
                ],
                answer: [2],
                explanation: "While admin can view ACLs, you must elevate to the security_admin role to create or modify ACL rules in ServiceNow.",
                multi: false
            },
            {
                id: 43,
                question: "True statements about impersonation? (Select 2)",
                options: [
                    "Admins gain additional access when impersonating scoped app admins",
                    "Admins may have limited access when impersonating scoped app admins",
                    "Non-admin impersonators have limited access when impersonating admin users",
                    "Impersonation gives full admin privileges to any user"
                ],
                answer: [1, 2],
                explanation: "Impersonation does not fully replicate all privileges. Admins may have limited access when impersonating a scoped app admin, and non-admins have limited access when impersonating admin users.",
                multi: true
            },
            {
                id: 44,
                question: "Which are external data sources supported by ServiceNow? (Select 3)",
                options: [
                    "LDAP",
                    "CSV",
                    "REST",
                    "JSON",
                    "OIDC"
                ],
                answer: [0, 2, 4],
                explanation: "LDAP, REST, and OIDC are external data source protocols/integrations. CSV and JSON are file formats used for imports, not external data sources.",
                multi: true
            },
            {
                id: 45,
                question: "What is created by default when you create a new table? (Select 2)",
                options: [
                    "Application Menu (same name as table)",
                    "Default ACL rules",
                    "Module (using plural table label)",
                    "Default data policy"
                ],
                answer: [0, 2],
                explanation: "By default, creating a new table also creates an Application Menu with the table name and a Module using the plural label of the table for navigation.",
                multi: true
            },
            {
                id: 46,
                question: "Which feature do you use to start creating a new application in ServiceNow?",
                options: [
                    "App Engine Studio",
                    "Guided Application Creator",
                    "Application Builder",
                    "Studio IDE"
                ],
                answer: [1],
                explanation: "Guided Application Creator walks you through the initial steps of defining and creating a new scoped application in ServiceNow.",
                multi: false
            },
            {
                id: 47,
                question: "Which server-side script runs automatically on database record events (insert, update, delete)?",
                options: [
                    "Client Script",
                    "Script Include",
                    "Business Rule",
                    "UI Policy"
                ],
                answer: [2],
                explanation: "Business Rules are server-side scripts that run automatically when a record is inserted, updated, deleted, or displayed.",
                multi: false
            },
            {
                id: 48,
                question: "Which role is required to split a form into multiple sections?",
                options: [
                    "itil",
                    "personalize_form",
                    "ui_admin",
                    "admin"
                ],
                answer: [3],
                explanation: "Splitting a form into multiple columns or sections requires the admin role in ServiceNow.",
                multi: false
            },
            {
                id: 49,
                question: "What are the steps to apply an Update Set to a target instance? (Select 3)",
                options: [
                    "Retrieve",
                    "Export",
                    "Preview",
                    "Validate",
                    "Commit"
                ],
                answer: [0, 2, 4],
                explanation: "Applying an Update Set involves three steps: Retrieve (load it into the instance), Preview (check for errors/conflicts), and Commit (apply the changes).",
                multi: true
            },
            {
                id: 50,
                question: "How do you access local flow variables within a Flow Designer flow?",
                options: [
                    "Via the Flow Variables tab in settings",
                    "As data pills in the Data panel",
                    "Through the Script step only",
                    "By declaring them in a Script Include"
                ],
                answer: [1],
                explanation: "Local flow variables appear as data pills in the Data panel and can be dragged and used directly in flow steps without scripting.",
                multi: false
            },
            {
                id: 51,
                question: "Which application is available to all users without a specific role?",
                options: [
                    "Incident Management",
                    "Self-Service",
                    "Service Desk",
                    "Asset Management"
                ],
                answer: [1],
                explanation: "The Self-Service application (including the Service Portal) is available to all users, including those without an ITIL or admin role.",
                multi: false
            },
            {
                id: 52,
                question: "What are the steps to add a second filter condition in a list view?",
                options: [
                    "Click OR, define second condition, click Run",
                    "Click AND, define second condition, click Run",
                    "Click Add Filter, define second condition, click Apply",
                    "Right-click column, select Add Condition, click Run"
                ],
                answer: [1],
                explanation: "To add a second filter condition in a list view, click AND, define the second condition, and then click Run to apply the combined filters.",
                multi: false
            },
            {
                id: 53,
                question: "Types of Client Scripts? (Select 4)",
                options: [
                    "onLoad()",
                    "onChange()",
                    "onDelete()",
                    "onSubmit()",
                    "onCellEdit()"
                ],
                answer: [0, 1, 3, 4],
                explanation: "The four types of Client Scripts are: onLoad() (runs when form loads), onChange() (runs when a field value changes), onSubmit() (runs before form is submitted), and onCellEdit() (runs when a cell is edited in a list).",
                multi: true
            },
            {
                id: 54,
                question: "Which ServiceNow feature tracks the time to complete tasks based on defined targets?",
                options: [
                    "Performance Analytics",
                    "Service Level Agreements (SLA)",
                    "Scheduled Reports",
                    "Flow Designer timers"
                ],
                answer: [1],
                explanation: "Service Level Agreements (SLAs) track time-based targets for tasks, such as response and resolution times for incidents.",
                multi: false
            },
            {
                id: 55,
                question: "Where do you navigate to edit an existing catalog item?",
                options: [
                    "Service Catalog > Items",
                    "Maintain Items",
                    "Service Catalog > Edit Item",
                    "Catalog Builder"
                ],
                answer: [1],
                explanation: "Existing catalog items are edited through the Maintain Items module in the Service Catalog application.",
                multi: false
            },
            {
                id: 56,
                question: "Where do you set notification preferences in ServiceNow?",
                options: [
                    "System Notification > Preferences",
                    "Profile > Notifications",
                    "User Menu",
                    "System Properties > Notifications"
                ],
                answer: [2],
                explanation: "Users set their notification preferences through the User Menu (top-right corner), where they can manage subscriptions and delivery options.",
                multi: false
            },
            {
                id: 57,
                question: "True statements about the admin role? (Select 3)",
                options: [
                    "Admin can grant security_admin to themselves",
                    "Admin alone cannot grant the security_admin role",
                    "Non-admin users cannot add users to admin groups",
                    "To grant the admin role, the user must already have admin",
                    "Admin automatically inherits security_admin"
                ],
                answer: [1, 2, 3],
                explanation: "Admin cannot self-grant security_admin (requires elevated privileges), non-admins cannot manage admin groups, and only an existing admin can grant the admin role to another user.",
                multi: true
            },
            {
                id: 58,
                question: "Which Security Center feature provides compliance scores and improvements?",
                options: [
                    "Security Dashboard",
                    "Compliance Monitor",
                    "Hardening",
                    "Risk Assessment"
                ],
                answer: [2],
                explanation: "The Hardening feature in Security Center shows your instance's compliance score, highlights areas for improvement, and allows comparisons against best practices.",
                multi: false
            },
            {
                id: 59,
                question: "Which statement is true about importing data into ServiceNow?",
                options: [
                    "Coalesce is mandatory for every import",
                    "Field mappings are automatically created",
                    "Every import must have at least one Transform Map",
                    "Import Sets can bypass the Transform Map"
                ],
                answer: [2],
                explanation: "Every import must have at least one Transform Map to map source data to the target table. Coalesce fields are optional (used to detect duplicates), and field mappings must be manually created.",
                multi: false
            },
            {
                id: 60,
                question: "Which tool maps imported fields from an Import Set to the target table?",
                options: [
                    "Field Mapper",
                    "Data Transformer",
                    "Transform Map",
                    "Import Schema"
                ],
                answer: [2],
                explanation: "A Transform Map defines how fields in an Import Set table map to fields in the target ServiceNow table. It is required for every data import.",
                multi: false
            }
        ]
    },
    6: {
        name: "Practice Test 6",
        total: 60,
        questions: [
            {
                id: 1,
                question: "What filter condition allows you to report on incidents created from the 'Create Incident' record producer where the value for the 'Urgency' question is '2-Medium'?",
                options: [
                    "Apply a filter condition: 'Questions.Create Incident.Urgency is 2-Medium.'",
                    "Apply a related list filter condition: 'Urgency is 2-Medium.'",
                    "Apply additional group by on 'Questions': 'Create Incident.Urgency'.",
                    "Apply a filter condition: 'Urgency is 2-Medium.'"
                ],
                answer: [0],
                explanation: "Record producer variables are stored under the Questions table and must be accessed via dot-walking: Questions.<Record Producer Name>.<Variable Name>. Normal fields like Urgency are different — you must use the Questions. prefix to filter on record producer variable values.",
                multi: false
            },
            {
                id: 2,
                question: "Which are valid report-sharing options? (Select 4)",
                options: [
                    "Add to dashboard",
                    "Clone",
                    "Schedule",
                    "Export to PDF",
                    "Take a screenshot",
                    "Publish"
                ],
                answer: [0, 2, 3, 5],
                explanation: "Valid platform-supported sharing methods are: Add to dashboard, Schedule (email delivery), Export to PDF, and Publish (make publicly accessible). Clone duplicates a report but is not a sharing feature, and screenshots are a manual workaround, not a system feature.",
                multi: true
            },
            {
                id: 3,
                question: "Which feature allows users to manage the notifications they receive?",
                options: [
                    "ServiceNow Mobile",
                    "Now on Now",
                    "Subscriptions",
                    "Platform Chat"
                ],
                answer: [2],
                explanation: "Subscriptions allow users to subscribe or unsubscribe to specific notifications, giving them control over what updates and alerts they receive from the platform.",
                multi: false
            },
            {
                id: 4,
                question: "What protects applications by restricting access to files and data?",
                options: [
                    "Access Control (ACL)",
                    "Application Scope",
                    "Admin role",
                    "Delegated Development"
                ],
                answer: [1],
                explanation: "Application Scope creates a boundary that isolates an app's data and resources, preventing cross-application interference. ACLs control user-level access, while Scope controls application-level boundaries.",
                multi: false
            },
            {
                id: 5,
                question: "Filter conditions in a list view are also referred to as:",
                options: [
                    "Column Headings",
                    "Title Bars",
                    "Field Values",
                    "Breadcrumbs"
                ],
                answer: [3],
                explanation: "In ServiceNow, the filter conditions applied to a list are displayed as Breadcrumbs at the top of the list, showing what filters are currently active.",
                multi: false
            },
            {
                id: 6,
                question: "What is the recommended way to combine Incident and SLA data for reporting?",
                options: [
                    "One-to-Many relationship",
                    "Many-to-Many relationship",
                    "Database Views",
                    "Table Extensions"
                ],
                answer: [2],
                explanation: "Database Views allow combining data from multiple related tables (Incident and Task SLA) into a single virtual table for reporting. The incident_sla join view is used specifically for this purpose.",
                multi: false
            },
            {
                id: 7,
                question: "Identify which tables are parent, base, or child in the CMDB hierarchy? (Select 4)",
                options: [
                    "Service table is a Child table",
                    "Base Configuration Item is a Base table",
                    "Base Configuration Item is a Parent table",
                    "Configuration Item is a Parent table",
                    "Service table is a Base table"
                ],
                answer: [0, 1, 2, 3],
                explanation: "CMDB hierarchy: cmdb (base) → cmdb_ci (Base Configuration Item — acts as both base and parent) → cmdb_ci_service (Service, child). A table can be both a parent (to tables below it) and a child (to tables above it).",
                multi: true
            },
            {
                id: 8,
                question: "What updates dynamic application services automatically?",
                options: [
                    "Operational status changes",
                    "CI relationship changes",
                    "CI reclassification",
                    "Unmatched CI detection"
                ],
                answer: [1],
                explanation: "Dynamic application services are defined by CI relationships in cmdb_rel_ci. When relationships change (CIs added, removed, or re-linked), the dynamic service membership updates automatically.",
                multi: false
            },
            {
                id: 9,
                question: "Which field type displays records from another table for selection?",
                options: [
                    "Choice",
                    "Reference",
                    "Attachments",
                    "String"
                ],
                answer: [1],
                explanation: "A Reference field points to records in another table, allowing users to search and select a related record (e.g., selecting a User or CI from another table).",
                multi: false
            },
            {
                id: 10,
                question: "Which modules can be used to create a table? (Select 2)",
                options: [
                    "Tables",
                    "Schema Map",
                    "Tables & Columns",
                    "Studio",
                    "Data Dictionary"
                ],
                answer: [0, 2],
                explanation: "Tables can be created via the 'Tables' module or the 'Tables & Columns' module under System Definition. Both provide the interface to define new tables in ServiceNow.",
                multi: true
            },
            {
                id: 11,
                question: "Which role is required to create or update ACL rules?",
                options: [
                    "admin",
                    "itil_admin",
                    "security_admin",
                    "acl_manager"
                ],
                answer: [2],
                explanation: "The security_admin role must be elevated to in order to create or modify ACL rules. Admin alone cannot create or modify ACLs without this elevated role.",
                multi: false
            },
            {
                id: 12,
                question: "What feature replaces traditional ServiceNow reporting for modern dashboards?",
                options: [
                    "Process Mining",
                    "UX Analytics",
                    "Data Visualizations",
                    "PA Widgets"
                ],
                answer: [2],
                explanation: "Data Visualizations (available in Platform Analytics / Next Experience) replace older Core UI reports and dashboards with modern, interactive visualizations.",
                multi: false
            },
            {
                id: 13,
                question: "What is the CMDB?",
                options: [
                    "A ticketing system for incidents",
                    "A database storing configuration records for infrastructure components",
                    "A workflow engine for IT processes",
                    "A reporting tool for IT metrics"
                ],
                answer: [1],
                explanation: "The Configuration Management Database (CMDB) stores configuration records (CIs) for all infrastructure components required to deliver IT services.",
                multi: false
            },
            {
                id: 14,
                question: "Where in email notification setup do you choose which fields to include in the message?",
                options: [
                    "When to send",
                    "Who will receive",
                    "What it will contain > Select variables",
                    "Advanced conditions"
                ],
                answer: [2],
                explanation: "In the 'What it will contain' section of a notification, you use 'Select variables' to choose which field values and data should appear in the email body.",
                multi: false
            },
            {
                id: 15,
                question: "What are the main UI sections of the ServiceNow platform interface? (Select 3)",
                options: [
                    "Banner frame",
                    "Footer frame",
                    "Content frame",
                    "Application navigator",
                    "Sidebar panel"
                ],
                answer: [0, 2, 3],
                explanation: "The ServiceNow UI has three main sections: the Banner frame (top bar with branding and user menu), the Application navigator (left-side menu), and the Content frame (main area displaying records and lists).",
                multi: true
            },
            {
                id: 16,
                question: "Ways to group list records by State? (Select 3)",
                options: [
                    "List context menu",
                    "Column context menu",
                    "Natural language filter",
                    "Form header menu",
                    "Export to Excel"
                ],
                answer: [0, 1, 2],
                explanation: "You can group list records by State using: the List context menu (hamburger icon), right-clicking the column header (Column context menu), or typing a group-by condition in the Natural language filter bar.",
                multi: true
            },
            {
                id: 17,
                question: "What risks are avoided by keeping security contacts updated? (Select 3)",
                options: [
                    "Delay in critical communication",
                    "Increased licensing costs",
                    "Missing time-sensitive alerts",
                    "Inability to handle security issues promptly",
                    "Loss of audit logs"
                ],
                answer: [0, 2, 3],
                explanation: "Keeping security contacts current ensures critical communications reach the right people without delay, time-sensitive alerts are not missed, and security issues can be handled promptly.",
                multi: true
            },
            {
                id: 18,
                question: "How is a Service Catalog organized?",
                options: [
                    "By workflows and approvals",
                    "By categories and subcategories",
                    "By user roles and permissions",
                    "By SLA priorities"
                ],
                answer: [1],
                explanation: "The Service Catalog is organized using Categories and Subcategories, which group related catalog items together to help users find and request services more easily.",
                multi: false
            },
            {
                id: 19,
                question: "Where in notification setup do you make a notification subscribable by users?",
                options: [
                    "When to send",
                    "Who will receive",
                    "What it will contain",
                    "Advanced conditions"
                ],
                answer: [1],
                explanation: "In the 'Who will receive' section, there is a checkbox to make the notification subscribable, allowing users to opt-in or opt-out of receiving it.",
                multi: false
            },
            {
                id: 20,
                question: "Which catalog component is used to group multiple catalog items into a single request?",
                options: [
                    "Variable Set",
                    "Catalog Category",
                    "Order Guide",
                    "Execution Plan"
                ],
                answer: [2],
                explanation: "An Order Guide groups multiple catalog items together so users can order several related items in a single request. It is ideal for onboarding scenarios (e.g., new employee hardware and software setup).",
                multi: false
            },
            {
                id: 21,
                question: "What information can be found on the details page of an application or plugin within the Application Manager? (Select 3)",
                options: [
                    "Release notes",
                    "Key features",
                    "Customer reviews",
                    "Pricing details",
                    "Compatibility"
                ],
                answer: [0, 1, 4],
                explanation: "The Application Manager details page displays release notes, key features, and compatibility info, along with a summary, current state, and technical dependencies. Specific pricing details and customer reviews are not shown on this page.",
                multi: true
            },
            {
                id: 22,
                question: "What type of Visual Task Board CANNOT be built from a record list?",
                options: [
                    "Guided",
                    "Flexible",
                    "Data Driven",
                    "Freeform"
                ],
                answer: [3],
                explanation: "A Freeform board is not based on a record list — task records must be added manually. Guided and Flexible boards are built directly from existing record lists.",
                multi: false
            },
            {
                id: 23,
                question: "Which ServiceNow product enables you to integrate with 3rd party applications without scripting?",
                options: [
                    "Flow Designer",
                    "Service Portal",
                    "Visual Task Boards",
                    "Integration Hub"
                ],
                answer: [3],
                explanation: "Integration Hub provides prebuilt spokes (triggers and actions) that connect ServiceNow to external systems like Slack or Microsoft Teams without writing code.",
                multi: false
            },
            {
                id: 24,
                question: "What are the three main tables in the CMDB? (Select 3)",
                options: [
                    "CMDB Baseline [cmdb_baseline]",
                    "CI Relationship [cmdb_rel_ci]",
                    "Base Configuration Item [cmdb]",
                    "Configuration Item [cmdb_ci]",
                    "CMDB Properties [cmdb_properties]"
                ],
                answer: [1, 2, 3],
                explanation: "The three core CMDB tables are: cmdb (base table for non-IT CIs), cmdb_ci (Configuration Item — IT-related classes descend from here), and cmdb_rel_ci (defines relationships between CIs).",
                multi: true
            },
            {
                id: 25,
                question: "Why do organisations fail to complete implementation or realise business value from the CMDB? (Select 3)",
                options: [
                    "Too many non-IT Configuration Items",
                    "Inconsistent data quality",
                    "Unknown Configuration Items",
                    "Ill-defined relationships among Configuration Items"
                ],
                answer: [1, 2, 3],
                explanation: "The primary challenges are: inconsistent data quality (unreliable records), unknown CIs (undiscovered assets), and ill-defined relationships (poorly mapped dependencies). Without accurate data and clear mapping, the CMDB cannot provide business value.",
                multi: true
            },
            {
                id: 26,
                question: "What form action updates an existing record and keeps the form open?",
                options: [
                    "Update",
                    "Insert",
                    "Save",
                    "Insert and Stay"
                ],
                answer: [2],
                explanation: "Save updates the record and keeps the user on the current form. Update saves changes and returns to the list view. Insert creates a new record, and Insert and Stay creates a new record while keeping the form open.",
                multi: false
            },
            {
                id: 27,
                question: "Which search feature can you use to narrow down search results in ServiceNow?",
                options: [
                    "Platform Locators",
                    "Context Finder",
                    "Wildcard Characters",
                    "Containers"
                ],
                answer: [2],
                explanation: "Wildcard characters refine search results. The percent sign (%) acts as a single-character wildcard and the asterisk (*) as a multi-character wildcard to narrow down results within lists.",
                multi: false
            },
            {
                id: 28,
                question: "What do Application Services represent from an Application Portfolio Management (APM) perspective?",
                options: [
                    "Servers",
                    "Installed Instances",
                    "Configuration Items",
                    "Production Instances"
                ],
                answer: [1],
                explanation: "From an APM perspective, an Application Service represents an installed instance of a business application (e.g., Dev, Test, or Production environments) — a set of interconnected apps and hosts configured to offer a specific service.",
                multi: false
            },
            {
                id: 29,
                question: "Which option allows you to update existing Target Table records when importing data from an import set?",
                options: [
                    "Transform",
                    "Coalesce",
                    "Unique",
                    "Mandatory"
                ],
                answer: [1],
                explanation: "Coalescing a field tells the import engine to check for existing records with matching values. If a match is found, the existing record is updated; if no match is found, a new record is created.",
                multi: false
            },
            {
                id: 30,
                question: "What needs to be configured to create a new form view?",
                options: [
                    "Form Layout",
                    "List Layout",
                    "List Design",
                    "Related List"
                ],
                answer: [0],
                explanation: "To create a new view, use Form Layout or Form Design. Both tools allow you to define which fields appear on a form and organize them into views for different user roles or processes.",
                multi: false
            },
            {
                id: 31,
                question: "Which of the following run scripts client-side? (Select 2)",
                options: [
                    "UI Policy",
                    "Client Script",
                    "Business Rule",
                    "Script Include"
                ],
                answer: [0, 1],
                explanation: "UI Policies and Client Scripts run in the user's browser (client-side). They change form behavior like making fields mandatory or visible. Business Rules and Script Includes run on the server.",
                multi: true
            },
            {
                id: 32,
                question: "Which Now Platform feature allows you to send notifications directly to Slack and Microsoft Teams users?",
                options: [
                    "Virtual Agent",
                    "Sidebar",
                    "Connect Chat",
                    "Now Notifications",
                    "ChatGPT"
                ],
                answer: [0],
                explanation: "Virtual Agent can send direct messages and notifications to Slack and Microsoft Teams. Users must link their third-party accounts to the ServiceNow instance for this to work.",
                multi: false
            },
            {
                id: 33,
                question: "Which user authentication method authenticates credentials against an external Identity Provider (IdP) with a matching user account in ServiceNow?",
                options: [
                    "Digest Token",
                    "External Single Sign-on (SSO)",
                    "Local database",
                    "Multi-factor authentication"
                ],
                answer: [1],
                explanation: "External SSO authenticates credentials against an external Identity Provider (IdP). Local database uses records stored directly in ServiceNow, and Digest Token uses an encrypted digest of the username/password.",
                multi: false
            },
            {
                id: 34,
                question: "Which of the following is the definition of a role in ServiceNow?",
                options: [
                    "An actor in user stories",
                    "A collection of permissions",
                    "A set of user access policies",
                    "A set of access control rules",
                    "A persona in workflows"
                ],
                answer: [1],
                explanation: "A role is a collection of permissions that allows users to perform specific actions or access modules. Roles can contain other roles, and granting a role to a group applies those permissions to all users in that group.",
                multi: false
            },
            {
                id: 35,
                question: "You need to go back to review a record you just looked at recently. What is the quickest way to navigate back to the same record?",
                options: [
                    "Impersonate another user",
                    "Expand every application in the All applications tab",
                    "Navigate back to its corresponding list",
                    "Select the record from the History tab"
                ],
                answer: [3],
                explanation: "The History tab (clock icon in the navigation bar) stores recently accessed records and lists in chronological order, making it the fastest way to return to a recent item.",
                multi: false
            },
            {
                id: 36,
                question: "Where in the import process is the relationship between import set fields and ServiceNow table fields defined?",
                options: [
                    "Target tables",
                    "Transform map",
                    "Import set table",
                    "External data sources",
                    "Database view"
                ],
                answer: [1],
                explanation: "A Transform Map acts as the bridge between the Import Set (source) and the ServiceNow table (target). It defines exactly how data from source fields should map to target fields.",
                multi: false
            },
            {
                id: 37,
                question: "Now Assist for CMDB brings generative AI to CMDB. What skills does this application provide? (Select 2)",
                options: [
                    "Add relationships",
                    "CSDM alignment",
                    "Manage duplicate CIs",
                    "Retire CIs",
                    "CI summarisation"
                ],
                answer: [2, 4],
                explanation: "Now Assist for CMDB provides two GenAI skills: CI summarisation (summarizes CI details including class, discovery info, and related incidents) and Manage duplicate CIs (guides users through the de-duplication remediation process).",
                multi: true
            },
            {
                id: 38,
                question: "In what order are access controls evaluated?",
                options: [
                    "Table-level and Field-level are evaluated together simultaneously",
                    "First at the Table-level (most specific to most general), then at the Field-level (most specific to most general)",
                    "First at the Field-level (most specific to most general), then at the Table-level (most specific to most general)",
                    "Table-level and Field-level are evaluated separately and independently"
                ],
                answer: [1],
                explanation: "ServiceNow first checks table-level access (most specific to most general rule). If granted, it then evaluates field-level permissions in the same order (most specific to most general).",
                multi: false
            },
            {
                id: 39,
                question: "What can be set up to auto-assign all new Hardware category Incidents to a particular group? (Select 3)",
                options: [
                    "Assignment rules",
                    "Data lookup rules",
                    "UI Actions",
                    "Access Controls",
                    "Business rules"
                ],
                answer: [0, 1, 4],
                explanation: "Assignment rules are the standard way to route tasks. Data lookup rules can set assignment groups based on field values. Business rules offer the most flexibility and can override other logic depending on execution order.",
                multi: true
            },
            {
                id: 40,
                question: "What is the main function of the ServiceNow Security Center (SCC)?",
                options: [
                    "To orchestrate security patching and updates",
                    "To control and improve security for managing data access",
                    "To provide security operations and command centre",
                    "To assess the instance's security posture using live metrics"
                ],
                answer: [3],
                explanation: "The Security Center (Hardening, Scanner, and Metrics tools) helps admins monitor the security health of their instance, identify misconfigurations, and maintain a strong security posture via real-time data.",
                multi: false
            },
            {
                id: 41,
                question: "What does a column in a list represent in a ServiceNow instance?",
                options: [
                    "A filter",
                    "A field",
                    "An attribute",
                    "A record"
                ],
                answer: [1],
                explanation: "In the ServiceNow database structure, each record corresponds to a row in a list, while each field within that record corresponds to a column in the list view.",
                multi: false
            },
            {
                id: 42,
                question: "Your director wants a snapshot of monthly resolved incidents automatically emailed to the executive group on the first of each month. What ServiceNow capability do you use?",
                options: [
                    "Published Reports",
                    "Scheduled Reports",
                    "Self-Service Analytics",
                    "Interactive Filters",
                    "Report Statistics",
                    "Data Collector"
                ],
                answer: [1],
                explanation: "Scheduled Reports automate the distribution of report snapshots via email in PDF, CSV, or XLS formats. You need the report_user role plus either report_admin or report_scheduler. Note: Maps and Pivot Tables cannot be scheduled.",
                multi: false
            },
            {
                id: 43,
                question: "What option allows catalogue item requesters to save an uncompleted form so they can submit it at another time?",
                options: [
                    "Save Form",
                    "Add to Favorite",
                    "Discard Draft",
                    "Save as Draft"
                ],
                answer: [3],
                explanation: "Save as Draft can be enabled for Service Portal and the Now Mobile app. It allows users to pause work on lengthy forms and resume later from the 'My Requests' widget under the 'Drafts' tab.",
                multi: false
            },
            {
                id: 44,
                question: "Which platform function uses machine learning to predict, recommend, and organise data outcomes such as auto-categorising and assigning incidents from the Short Description?",
                options: [
                    "Agent Assist",
                    "Virtual Agent",
                    "User Experience Analytics",
                    "Predictive Intelligence",
                    "Natural Language Understanding",
                    "Performance Analytics"
                ],
                answer: [3],
                explanation: "Predictive Intelligence is a platform-layer AI that uses machine-learning algorithms to automate tasks. Its classification framework can analyze a Short Description to automatically set the Category or Assignment group, reducing manual errors and resolution time.",
                multi: false
            },
            {
                id: 45,
                question: "What is the best way to privately suggest an article revision to the knowledge manager from the Service Portal?",
                options: [
                    "Edit article",
                    "Rate article",
                    "Flag article",
                    "Leave comments"
                ],
                answer: [2],
                explanation: "Flagging an article allows a user to privately suggest revisions. Flagged comments are only visible to users with knowledge management roles (knowledge_admin, knowledge_manager) and do not appear publicly on the Article View page.",
                multi: false
            },
            {
                id: 46,
                question: "What do access control list rules specify? (Select 2)",
                options: [
                    "The permissions required to access the object",
                    "The object and operation being secured",
                    "The relationship between the object and the operation",
                    "The operation required to access the object"
                ],
                answer: [0, 1],
                explanation: "Every ACL rule defines three things: the Object being secured (table/field), the Operation (read, write, create, delete), and the Permissions (roles, conditions, or scripts) required to perform that operation on that object.",
                multi: true
            },
            {
                id: 47,
                question: "How can you edit a Knowledge article using the Now Assist context menu feature in Knowledge Management?",
                options: [
                    "Improve or extend content",
                    "Elaborate or shorten content",
                    "Localise and translate content",
                    "Check for spelling and grammar errors"
                ],
                answer: [1],
                explanation: "Now Assist for Knowledge Management includes an 'Elaborate' or 'Shorten' context menu option, allowing authors to use GenAI to quickly expand on a brief point or condense a lengthy section directly within the editor.",
                multi: false
            },
            {
                id: 48,
                question: "Which of the following are database view limitations? (Select 3)",
                options: [
                    "It is not possible to edit data within a database view",
                    "The 'where' clauses in the database view cannot be based on indexed fields",
                    "Database views cannot be created on tables that participate in table rotation",
                    "In a clone request, database view tables cannot be added as a data preserver"
                ],
                answer: [0, 2, 3],
                explanation: "Database views are read-only joined versions of tables. They cannot be edited, cannot be used as data preservers during clones, and cannot target tables involved in table rotation.",
                multi: true
            },
            {
                id: 49,
                question: "How can you improve the performance of the CSDM and CMDB Data Foundations Dashboards?",
                options: [
                    "By adding custom-built metrics",
                    "By restricting access to certain roles",
                    "By enabling new metrics",
                    "By increasing the load time property",
                    "By deactivating unnecessary metrics"
                ],
                answer: [4],
                explanation: "To improve dashboard performance, deactivate metrics that are not needed. Navigate to the sn_getwell_metric table and set the 'Active' column to false for specific indicators that consume excessive resources.",
                multi: false
            },
            {
                id: 50,
                question: "What type of Flow Designer trigger is needed for an Inbound Email Action?",
                options: [
                    "Application-based",
                    "Role-based",
                    "Schedule-based",
                    "Record-based"
                ],
                answer: [0],
                explanation: "Flow Designer uses Application-based triggers for inbound emails. These are added when the associated application spoke is active. Inbound email flows take priority; if a match is found, it may stop processing before reaching traditional Inbound Email Actions.",
                multi: false
            },
            {
                id: 51,
                question: "Which of the following are UI actions in a form? (Select 3)",
                options: [
                    "Form buttons",
                    "Form links (Related Links in a form)",
                    "Form context menu items (right-click the header)",
                    "Form access",
                    "Form relationships"
                ],
                answer: [0, 1, 2],
                explanation: "UI Actions make the UI interactive. In a form they manifest as buttons (Save, Update), links at the bottom (Related Links), or right-clicking the form header (Context Menu items).",
                multi: true
            },
            {
                id: 52,
                question: "How do you navigate the Now Platform to see a list of catalogue items for administration?",
                options: [
                    "Item Designer > Administration > All Items",
                    "Service Catalog > Catalog Definitions > Maintain Items",
                    "Self-Service > Service Catalog",
                    "Service Catalog > Open Records > Items"
                ],
                answer: [1],
                explanation: "To manage, edit, or create catalog items, administrators navigate to Service Catalog > Catalog Definitions > Maintain Items. Self-Service > Service Catalog allows users to order items but is not the admin management path.",
                multi: false
            },
            {
                id: 53,
                question: "What is an update set?",
                options: [
                    "A series of tables and fields that store CI information",
                    "A security method that restricts access to data",
                    "A server-side script that runs on record events",
                    "A group of one or more changes that can be moved from one instance to another"
                ],
                answer: [3],
                explanation: "An update set is an XML package of configuration changes (business rules, client scripts, table definitions, etc.) that allows developers to build and test in non-production and promote those changes to Production as a single unit.",
                multi: false
            },
            {
                id: 54,
                question: "What are some possible methods of populating a knowledge base with knowledge articles? (Select 3)",
                options: [
                    "Creating articles directly in the ServiceNow platform",
                    "Importing Microsoft Word files",
                    "Integrating with a WebDAV compliant source",
                    "Via e-mail to a defined knowledge e-mail address"
                ],
                answer: [0, 1, 2],
                explanation: "Knowledge bases can be populated by manually typing articles in ServiceNow, importing external .docx files, or setting up a WebDAV (Web Distributed Authoring and Versioning) integration to pull content from external sources.",
                multi: true
            },
            {
                id: 55,
                question: "What framework in Flow Designer helps you select the next component in your flow from a list of AI-generated recommendations?",
                options: [
                    "Flow Diagramming",
                    "Generative AI Controller",
                    "Now Assist",
                    "AI Search",
                    "Predictive Intelligence"
                ],
                answer: [2],
                explanation: "Now Assist for Creator provides AI-generated recommendations for the next step in a flow. It analyzes the current position and previous components to suggest the most relevant actions, flow logic, or subflows available.",
                multi: false
            },
            {
                id: 56,
                question: "What are the two available knowledge article types? (Select 2)",
                options: [
                    "HTML",
                    "Wiki",
                    "Plain Text",
                    "CSS"
                ],
                answer: [0, 1],
                explanation: "When creating a knowledge article, contributors can choose HTML (WYSIWYG editor for text, images, and links) or Wiki (markup language). The type is selected in the 'Article type' field on the standard template.",
                multi: true
            },
            {
                id: 57,
                question: "Which of the following products support dark theme in the Next Experience UI? (Select 3)",
                options: [
                    "AI Search",
                    "Knowledge Management",
                    "Natural Language Understanding",
                    "Assessments and Surveys",
                    "Dashboards and Reports"
                ],
                answer: [1, 3, 4],
                explanation: "In the Next Experience UI, dark theme is supported in Knowledge Management article pages, Dashboards and Reports visualizations, and the Assessments and Surveys interface to improve visual clarity and reduce eye strain.",
                multi: true
            },
            {
                id: 58,
                question: "What is the primary language used for scripting in ServiceNow?",
                options: [
                    "JavaScript",
                    "Jelly",
                    "Java",
                    "AngularJS"
                ],
                answer: [0],
                explanation: "JavaScript is the core scripting language used in ServiceNow for both client-side and server-side scripts (Business Rules, Client Scripts, Script Includes, etc.). Jelly is used for older UI pages and AngularJS for Service Portal widgets.",
                multi: false
            },
            {
                id: 59,
                question: "How long are audit histories maintained in a ServiceNow instance?",
                options: [
                    "During contract terms",
                    "12 months",
                    "Indefinitely",
                    "30 days"
                ],
                answer: [2],
                explanation: "Audit records (stored in the sys_audit table) are kept indefinitely so administrators can track the full historical lifecycle of any record. However, as this table grows, querying smaller subset tables is recommended for better performance.",
                multi: false
            },
            {
                id: 60,
                question: "By default, a report is shared with the following:",
                options: [
                    "Only groups that the report creator belongs to",
                    "All users and groups",
                    "The report creator only",
                    "All roles"
                ],
                answer: [2],
                explanation: "When a new report is created, its sharing visibility defaults to 'Me' (the creator only). The creator must manually change the sharing settings to make it visible to specific users, groups, or globally to all users.",
                multi: false
            }
        ]
    },
    7: {
        name: "Practice Test 7",
        total: 60,
        questions: [
            {
                id: 1,
                question: "Where can you organise form sections and related lists into tabs in classic forms?",
                options: [
                    "User Menu > Preferences > Display",
                    "All > System UI > Forms",
                    "User Menu > Preferences > Accessibility",
                    "All > System UI > Related lists"
                ],
                answer: [0],
                explanation: "In the Next Experience UI, toggle 'Tabbed forms' under User Menu > Preferences > Display. This organizes form sections and related lists into tabs, reducing scrolling and allowing more efficient navigation.",
                multi: false
            },
            {
                id: 2,
                question: "What type of Flow Designer Trigger is required to look up a record, update a field value, and request approval?",
                options: [
                    "Application-based",
                    "Schedule-based",
                    "Role-based",
                    "Record-based"
                ],
                answer: [3],
                explanation: "A Record-based trigger fires when a record is created, updated, or both. This is the standard trigger type for processes like approvals and field updates tied to a specific record in a table.",
                multi: false
            },
            {
                id: 3,
                question: "What feature creates reusable components to run everyday tasks in Virtual Agent conversations?",
                options: [
                    "Chat re-route",
                    "Virtual transfer",
                    "Agent transfer",
                    "Topic blocks"
                ],
                answer: [3],
                explanation: "Topic blocks are pre-built, reusable components that perform specific functions (like checking agent availability or generating search results). They simplify topic authoring by allowing reuse of standard procedures across conversation topics.",
                multi: false
            },
            {
                id: 4,
                question: "How do you define an ACL rule to prevent user access unless the role, condition, and script requirements are all met?",
                options: [
                    "Deny-Unless decision type",
                    "UserIsAuthenticated security attribute",
                    "Read-only Protection policy",
                    "Query_match operation"
                ],
                answer: [0],
                explanation: "Deny Access (Deny-Unless) proactively denies access to a resource unless every role, condition, and script requirement is satisfied. Deny-Unless ACLs are evaluated first and take priority over Allow-If rules.",
                multi: false
            },
            {
                id: 5,
                question: "What dictionary attribute do you use to list all the columns you want visible on a reference field's drop-down list?",
                options: [
                    "ref_ac_columns_search",
                    "ref_ac_order_by",
                    "ref_auto_completer",
                    "ref_ac_columns"
                ],
                answer: [3],
                explanation: "The ref_ac_columns attribute specifies which columns from the reference table appear in the auto-completion drop-down list. Column names should be separated by a semicolon.",
                multi: false
            },
            {
                id: 6,
                question: "What allows users to see a time-stamped history of all actions taken within a record?",
                options: [
                    "Activity Stream",
                    "Form Activity",
                    "Form History",
                    "Favourites"
                ],
                answer: [0],
                explanation: "The Activity Stream provides a chronological, time-stamped list of entries including journal fields like comments and work notes, offering a clear audit trail of all actions taken on a record.",
                multi: false
            },
            {
                id: 7,
                question: "Which of the following roles CANNOT be delegated? (Select 2)",
                options: [
                    "admin",
                    "itil",
                    "user_admin",
                    "role_delegator"
                ],
                answer: [0, 3],
                explanation: "By default, highly sensitive roles like admin, public, and nobody cannot be delegated. A user with the role_delegator role also cannot delegate that specific role to other group members.",
                multi: true
            },
            {
                id: 8,
                question: "What field attributes can a UI Policy Action change on a form? (Select 3)",
                options: [
                    "Prevent cell editing",
                    "Visible / Hidden",
                    "Mandatory",
                    "Read-only",
                    "Change colour"
                ],
                answer: [1, 2, 3],
                explanation: "UI Policy Actions dynamically change field behavior on a form. The three standard attributes they control are: Mandatory (required to submit), Visible/Hidden (show or hide the field), and Read-only (prevent editing).",
                multi: true
            },
            {
                id: 9,
                question: "What is the best way to share a knowledge article with another user?",
                options: [
                    "A permalink",
                    "Taking a screenshot",
                    "Sharing the keywords",
                    "Copying and pasting the text"
                ],
                answer: [0],
                explanation: "Permalinks provide a direct URL to the latest version of a knowledge article, ensuring the recipient always sees the most current information within the Service Portal interface.",
                multi: false
            },
            {
                id: 10,
                question: "What coalesce configuration treats all imported rows as new records and does not update existing records?",
                options: [
                    "Single-field coalesce",
                    "No coalesce",
                    "Conditional coalesce",
                    "Multi-field coalesce"
                ],
                answer: [1],
                explanation: "If No coalesce is defined, the system does not check for existing matching records and simply treats every imported row as a brand-new record, inserting it without updating anything.",
                multi: false
            },
            {
                id: 11,
                question: "What field type on a form has a clickable icon that provides a preview of the associated record?",
                options: [
                    "Preview",
                    "Database",
                    "Pop-up",
                    "Reference",
                    "Function",
                    "Lookup",
                    "Clickthrough"
                ],
                answer: [3],
                explanation: "A Reference field stores a link to a record in another table (e.g., 'Caller' on Incident refers to the User table). When populated, a reference icon appears; clicking it opens a read-only preview of the referenced record without leaving the current page.",
                multi: false
            },
            {
                id: 12,
                question: "What can you do using the CMDB Data Manager? (Select 3)",
                options: [
                    "Manage retirement definitions and exclusion lists",
                    "Monitor the overall health and performance of the CMDB",
                    "Perform regular data backups for the CMDB",
                    "Create new CI classes in the CMDB",
                    "Administer and manage policies and tasks",
                    "Review and approve or reject assigned tasks"
                ],
                answer: [0, 4, 5],
                explanation: "CMDB Data Manager is a policy-driven framework for bulk CI lifecycle management. It allows you to manage retirement definitions and exclusion lists, administer policies and tasks, and review/approve/reject assigned lifecycle tasks within CMDB Workspace.",
                multi: true
            },
            {
                id: 13,
                question: "What report type requires access to the underlying data to view it?",
                options: [
                    "Bar chart",
                    "Donut chart",
                    "List report",
                    "Pie chart"
                ],
                answer: [2],
                explanation: "Graphic reports (Bar, Donut, Pie) present aggregate data visible to shared users without access to underlying records. A List report displays individual record data directly, so the viewer must have appropriate ACL permissions.",
                multi: false
            },
            {
                id: 14,
                question: "What results are displayed when searching for the keyword 'service' in the Filter field? (Select 2)",
                options: [
                    "Any module with a name containing 'service'",
                    "Only applications, sections and modules with names containing 'service'",
                    "All modules and sections within the 'Service Desk' application",
                    "Only applications with a name containing 'service'"
                ],
                answer: [0, 2],
                explanation: "The Filter Navigator displays any module whose name matches the keyword. If an application name matches (e.g., 'Service Desk'), all its underlying modules and sections are displayed even if they don't individually contain the keyword.",
                multi: true
            },
            {
                id: 15,
                question: "Where can you find information about new and important features for applications including features from the latest ServiceNow release?",
                options: [
                    "Release Center",
                    "Resource Center",
                    "Help Center",
                    "Customer Success Center"
                ],
                answer: [2],
                explanation: "The Help Center includes a 'What's New' tab showing new and updated features since the last release. A blue dot on the Help Center icon indicates new content is available to review.",
                multi: false
            },
            {
                id: 16,
                question: "Which of the following are true statements about platform scripting? (Select 3)",
                options: [
                    "Data Policy can be run as a UI policy client-side",
                    "UI Actions can execute both client-side and server-side",
                    "Client scripts can only execute on the browser but not when a database lookup is needed",
                    "Business rules are not real-time and do not monitor fields on a form"
                ],
                answer: [0, 1, 3],
                explanation: "Business Rules run on the server when records are queried or modified — not in real-time on the form. UI Actions can handle both browser-side clicks and server-side processing. Data Policies can be set to 'Use as UI Policy on client' to enforce data consistency in the browser.",
                multi: true
            },
            {
                id: 17,
                question: "Which of the following are valid statements about Flow Designer? (Select 3)",
                options: [
                    "Integrates with third-party systems",
                    "Requires scripting experience",
                    "Saves time",
                    "Provides automation tools"
                ],
                answer: [0, 2, 3],
                explanation: "Flow Designer is a no-code interface used to automate business logic. Key benefits include saving development time, providing automation tools, and integrating with external systems via Integration Hub spokes — without requiring scripting expertise.",
                multi: true
            },
            {
                id: 18,
                question: "Which of the following tabs are used to configure an email notification? (Select 3)",
                options: [
                    "Which email template",
                    "What the subject is",
                    "What it will contain",
                    "Who will receive",
                    "When to send"
                ],
                answer: [2, 3, 4],
                explanation: "The Notification form has three primary configuration tabs: When to send (defines triggers/conditions), Who will receive (defines recipients), and What it will contain (defines the subject line and message body).",
                multi: true
            },
            {
                id: 19,
                question: "What phase of the Report Designer allows you to choose the title, colours, and chart properties?",
                options: [
                    "Type",
                    "Style",
                    "Data",
                    "Configure"
                ],
                answer: [1],
                explanation: "The Report Designer has four phases: Data (select source), Type (select visualization format), Configure (grouping/calculations), and Style (customize titles, colors, and chart-specific properties).",
                multi: false
            },
            {
                id: 20,
                question: "What is a transform map in ServiceNow?",
                options: [
                    "A map used to store the history of incident records",
                    "A map used to add data to encrypted fields",
                    "A map used to trigger Business Rules before data is queued in an outbound Web Service",
                    "A map to determine relationships between fields in an Import Set and fields in an existing table"
                ],
                answer: [3],
                explanation: "A Transform Map is a set of field maps guiding movement of data from an Import Set table (source) to a permanent ServiceNow table (target). It determines exactly which source field maps to which target field during the import process.",
                multi: false
            },
            {
                id: 21,
                question: "What are the benefits of Flow Designer? (Select 3)",
                options: [
                    "Provides natural-language descriptions of flow logic",
                    "Promotes process automation by enabling subject matter experts to develop and share reusable actions",
                    "Provides multiple environments to build and visualise business processes",
                    "Provides configuration and runtime information to create, operate and troubleshoot flows from a single interface",
                    "Allows extending flow content by replacing workflows"
                ],
                answer: [0, 1, 3],
                explanation: "Flow Designer provides a single interface combining configuration and runtime data for easier troubleshooting. It uses natural-language descriptions for non-technical users and allows subject matter experts to create reusable actions without scripting.",
                multi: true
            },
            {
                id: 22,
                question: "What is the recommended way to share a report?",
                options: [
                    "Email an attachment",
                    "Download as PDF",
                    "Publish to an instance URL",
                    "Select Share"
                ],
                answer: [3],
                explanation: "The 'Share' option ensures recipients see live, up-to-date data when they run the report. PDF exports and email attachments create static snapshots that become outdated quickly.",
                multi: false
            },
            {
                id: 23,
                question: "What allows you to see more information on the same screen real estate when using Visual Task Boards?",
                options: [
                    "Compact Cards",
                    "Card Thumbnails",
                    "Minimise Tasks",
                    "Card Groups"
                ],
                answer: [0],
                explanation: "Enabling 'Compact Cards' decreases lane width and reduces info shown on each card (hiding thumbnails etc.), allowing more cards and lanes to fit on screen at once.",
                multi: false
            },
            {
                id: 24,
                question: "What are the different levels of ServiceNow security before an end-user can perform CRUD operations on a table? (Select 3)",
                options: [
                    "Database Access",
                    "User Authentication",
                    "Anonymous Access",
                    "3rd Party Application Security",
                    "Application and Modules Access"
                ],
                answer: [0, 1, 4],
                explanation: "ServiceNow uses a layered security model: User Authentication (login security), Application and Module Access (controlled via Roles), and Database Access (controlled via ACLs that restrict CRUD operations on specific tables and fields).",
                multi: true
            },
            {
                id: 25,
                question: "Where do you define user conditions to determine who can access catalogue items?",
                options: [
                    "User criteria [user_criteria]",
                    "Catalogue Client Scripts [catalog_script_client]",
                    "Catalogue UI Policies [catalog_ui_policy]",
                    "Service Catalogue Configuration / Properties [system_properties_servicecatalog_ui]"
                ],
                answer: [0],
                explanation: "User Criteria defines conditions evaluated against user records (like department, location, or role) to determine who can see and order specific catalogue items or categories.",
                multi: false
            },
            {
                id: 26,
                question: "What aspects of the Service Catalog application can a Catalog Administrator manage? (Select 3)",
                options: [
                    "Categories",
                    "Business Rules",
                    "Catalog Items",
                    "Catalogs",
                    "Scripting functions"
                ],
                answer: [0, 2, 3],
                explanation: "Users with the catalog_admin role can manage the catalogs themselves, the categories within them, and the individual catalog items. They generally do not manage technical scripting or system-wide business rules.",
                multi: true
            },
            {
                id: 27,
                question: "What model/standard across applications helps track life cycle stages and stage statuses for CIs effectively?",
                options: [
                    "Product Catalogue Data Model",
                    "CMDB Data Model",
                    "Common Service Data Model (CSDM)",
                    "Universal Task data model"
                ],
                answer: [2],
                explanation: "The CSDM provides a standard set of fields and values for tracking CI life cycle stages consistently across the platform, helping map legacy fields to a unified standard for better reporting and management.",
                multi: false
            },
            {
                id: 28,
                question: "What plugin must be activated to onboard a large volume of external users to a custom application in your instance?",
                options: [
                    "Integrations - External Authentication Framework [com.glide.external.app]",
                    "External User Registration [sn_ext_usr_reg]",
                    "External User Self-Registration [com.snc.external_user_self_registration]",
                    "User Registration Request [com.snc.user_registration]"
                ],
                answer: [2],
                explanation: "The External User Self-Registration plugin allows external users to register themselves for a ServiceNow application without manual administrator intervention, including identity verification and captcha support.",
                multi: false
            },
            {
                id: 29,
                question: "What wildcard character is used to search for values that contain a search term in a list?",
                options: [
                    "* (Asterisk)",
                    "% (Per cent sign)",
                    "! (Exclamation mark)",
                    "= (Equal sign)"
                ],
                answer: [0],
                explanation: "In ServiceNow list searches, the asterisk (*) is the 'contains' operator. For example, searching *email returns records where 'email' appears anywhere in the string.",
                multi: false
            },
            {
                id: 30,
                question: "What is granted to non-administrators for them to develop applications?",
                options: [
                    "Access Control",
                    "The developer role",
                    "Delegated Development",
                    "The itil role"
                ],
                answer: [2],
                explanation: "Delegated Development allows administrators to grant specific development and deployment permissions to non-admin users for a specific application, enabling them to build apps without full system administrator access.",
                multi: false
            },
            {
                id: 31,
                question: "What variable type do you use to allow requesting a catalogue item on behalf of another user or multiple users?",
                options: [
                    "Single Line Text",
                    "Requested For",
                    "Lookup Select Box",
                    "List Collector"
                ],
                answer: [1],
                explanation: "The 'Requested For' variable enables the delegated request experience. It allows a user to specify a different recipient from the sys_user table. Enabling 'Also request for' allows adding multiple users to a single request.",
                multi: false
            },
            {
                id: 32,
                question: "What sorting options are available when searching for a knowledge article on the Knowledge portal? (Select 4)",
                options: [
                    "Newest",
                    "Relevancy",
                    "Alphabetical",
                    "Category",
                    "Rating",
                    "Views"
                ],
                answer: [0, 1, 2, 5],
                explanation: "The Knowledge Result Sort widget provides four sorting methods: Relevancy (search term match), Views (number of article views), Newest (creation/update date), and Alphabetical (Short Description). Category and Rating are used for filtering, not sorting.",
                multi: true
            },
            {
                id: 33,
                question: "What is a CI? (Select 3)",
                options: [
                    "configuration_admin role",
                    "Configuration Item",
                    "Tangible entities (e.g. hardware, software, servers)",
                    "Intangible entities (e.g. business services, email)",
                    "Configuration Management Database"
                ],
                answer: [1, 2, 3],
                explanation: "A Configuration Item (CI) is any component that needs to be managed to deliver an IT Service. This includes tangible items (routers, servers) and intangible items (business services, applications, database instances).",
                multi: true
            },
            {
                id: 34,
                question: "Which knowledge feedback option CANNOT be disabled at the knowledge base level?",
                options: [
                    "Commenting",
                    "Flagging",
                    "Rating",
                    "Marking as helpful",
                    "All of them can be disabled"
                ],
                answer: [4],
                explanation: "All knowledge feedback features — Commenting, Flagging, Rating, and Mark as Helpful — can be independently disabled at the Knowledge Base level using 'Disable' fields on the Knowledge Base form.",
                multi: false
            },
            {
                id: 35,
                question: "Multiple Choice, Single Line Text, and Select Box are what type of elements in ServiceNow?",
                options: [
                    "Related Lists",
                    "Request Types",
                    "Variable Types",
                    "Order Guides"
                ],
                answer: [2],
                explanation: "These are Variable Types used to define questions on a catalogue item. Multiple Choice creates radio buttons, Single Line Text creates a free-text field, and Select Box creates a dropdown list of predefined choices.",
                multi: false
            },
            {
                id: 36,
                question: "How can organisations ensure consistent security hygiene across their ServiceNow instances?",
                options: [
                    "By scheduling regular reviews of the Security Center with the security and leadership teams",
                    "By implementing all recommendations provided by the Security Center's Best Practices and Hardening features",
                    "By relying solely on the Security Center's automated scans to identify and address security vulnerabilities",
                    "By enabling comprehensive logging of all activity and regularly reviewing the logs",
                    "By outsourcing all security management tasks to a third-party security provider"
                ],
                answer: [0],
                explanation: "Consistent security hygiene requires ongoing human evaluation and strategic review with leadership to adapt the instance's security posture to evolving threats. Automated tools are helpful but not sufficient alone.",
                multi: false
            },
            {
                id: 37,
                question: "What integration with Catalog Builder enables you to translate catalogue item content on the Catalog Builder dashboard?",
                options: [
                    "Globalisation Framework",
                    "Translation Framework",
                    "Internationalisation Framework",
                    "Localization Framework"
                ],
                answer: [3],
                explanation: "When the Localization Framework plugin is installed, it integrates with Catalog Builder, allowing users to request translations or use the Comparison UI to translate catalogue item content into multiple languages from the dashboard.",
                multi: false
            },
            {
                id: 38,
                question: "What types of permissions can be configured in an access control rule? (Select 3)",
                options: [
                    "Conditions",
                    "Roles",
                    "A script that sets the 'answer' variable to true or false",
                    "Groups",
                    "Users"
                ],
                answer: [0, 1, 2],
                explanation: "To pass an ACL, a user must meet all three requirements if configured: the Condition must evaluate to true, the Script must set answer = true, and the user must have one of the specified Roles.",
                multi: true
            },
            {
                id: 39,
                question: "What is the primary purpose of ServiceNow's Security Posture Dashboards?",
                options: [
                    "To provide a consolidated view for monitoring the security health of all your instances",
                    "To configure and manage user access controls and permissions within ServiceNow",
                    "To automatically remediate security vulnerabilities detected in your ServiceNow instances",
                    "To generate detailed reports for compliance audits and regulatory requirements"
                ],
                answer: [0],
                explanation: "Security Posture Dashboards aggregate security KPIs across one or multiple instances, providing an 'at a glance' view of security health including user login protection, instance hardening, and data protection metrics.",
                multi: false
            },
            {
                id: 40,
                question: "Which of the following are captured in an update set? (Select 3)",
                options: [
                    "Published Flows",
                    "Business Rules",
                    "Modified CIs",
                    "New Data Records",
                    "Report Definitions"
                ],
                answer: [0, 1, 4],
                explanation: "Update sets capture configuration changes: Business Rules, Client Scripts, Tables, Forms, Report Definitions, and Published Flows. They do NOT capture data records such as new users, groups, modified CIs, or tasks.",
                multi: true
            },
            {
                id: 41,
                question: "Which icon allows you to access resources such as ServiceNow documentation and user guide?",
                options: [
                    "Gear icon",
                    "Lock icon",
                    "Magnifier icon",
                    "Funnel icon",
                    "Book icon",
                    "Question mark icon"
                ],
                answer: [5],
                explanation: "The question mark icon in the header provides access to the system user guide and external documentation. The user guide allows organizations to create specific help documentation for general navigation.",
                multi: false
            },
            {
                id: 42,
                question: "What IT challenges can be solved with the CMDB? (Select 3)",
                options: [
                    "Consolidate disparate CI data into a single Configuration Management Database",
                    "Regularly maintain complex data for accuracy",
                    "Make sense of data to drive decisions and services",
                    "Store well-defined relationships",
                    "Capture known Configuration Items (CIs)"
                ],
                answer: [0, 1, 2],
                explanation: "The CMDB solves challenges by consolidating data from various sources into one place, providing tools to maintain that data's accuracy over time, and turning raw infrastructure data into actionable insights for decision-making.",
                multi: true
            },
            {
                id: 43,
                question: "What are the main ways to create a Platform Analytics dashboard? (Select 2)",
                options: [
                    "Technical editor / UI Builder",
                    "PA widget forms",
                    "Report Designer",
                    "In-line editor"
                ],
                answer: [0, 3],
                explanation: "Platform Analytics dashboards are created using the in-line editor (drag-and-drop for most users) or the technical editor/UI Builder (for developers needing advanced customization and data binding).",
                multi: true
            },
            {
                id: 44,
                question: "Where do ServiceNow client-side scripts execute?",
                options: [
                    "Application Server",
                    "Internet",
                    "Web Browser",
                    "ServiceNow Database"
                ],
                answer: [2],
                explanation: "Client-side scripts (Client Scripts and UI Policies) run within the user's web browser. They execute JavaScript locally to react to events like form loads or field changes without waiting for a server response.",
                multi: false
            },
            {
                id: 45,
                question: "An ACL rule grants users access to an object if they meet all required permissions. Which of the following must be satisfied? (Select 3)",
                options: [
                    "Either the matching table level or field level ACL must evaluate to true",
                    "The script must evaluate to true or return an answer variable with the value of true",
                    "The condition must evaluate to true",
                    "The user must have one of the roles in the required roles list (empty list evaluates to true)"
                ],
                answer: [1, 2, 3],
                explanation: "For an ACL to grant access: the Condition must evaluate to true, the Script (if present) must return true, and the user must have one of the required Roles (an empty role list always evaluates to true).",
                multi: true
            },
            {
                id: 46,
                question: "Which table does the Change Request [change_request] extend?",
                options: [
                    "Task [task]",
                    "Problem [problem]",
                    "Request [sc_request]",
                    "Incident [incident]"
                ],
                answer: [0],
                explanation: "The Task table is the base class for core ITSM applications. Incident, Problem, and Change Request all extend Task, sharing common fields like 'Short description', 'Assigned to', and 'State'.",
                multi: false
            },
            {
                id: 47,
                question: "Administrators and developers can create tables that do not exist in the base system to store application data. What are these tables called?",
                options: [
                    "Remote tables",
                    "Related tables",
                    "Extended tables",
                    "Target tables",
                    "Child tables",
                    "Custom tables",
                    "Core tables"
                ],
                answer: [5],
                explanation: "Custom tables are created by users to support specific business needs or custom applications and do not come as part of the ServiceNow base system. Core tables are provided by ServiceNow out of the box.",
                multi: false
            },
            {
                id: 48,
                question: "What role is required to toggle the template bar and apply global templates to forms?",
                options: [
                    "template_admin",
                    "template_editor",
                    "No special role required",
                    "form_admin"
                ],
                answer: [2],
                explanation: "Any user can access the template bar at the bottom of a form and apply available templates. However, creating or editing global templates typically requires specific admin roles like template_admin.",
                multi: false
            },
            {
                id: 49,
                question: "Which of the following best defines an application service?",
                options: [
                    "It supports multiple configuration strategies",
                    "An application service monitors services in an organisation",
                    "It is a set of interconnected applications and hosts configured to offer a service to an organisation",
                    "It provides standard fields and values for tracking life-cycle stages"
                ],
                answer: [2],
                explanation: "An application service is a logical representation of a deployed application environment (e.g., production instance of a website). It groups the CIs (servers, databases, software) that work together to provide a specific business service.",
                multi: false
            },
            {
                id: 50,
                question: "Which form view is displayed when clicking on the reference icon of a field in a form?",
                options: [
                    "sys_popup",
                    "VTB",
                    "Self Service",
                    "Service Portal"
                ],
                answer: [0],
                explanation: "Clicking the reference info icon uses the sys_popup view of the target table to determine which fields to show in the preview window. If no sys_popup view is defined, the system defaults to the 'Default' view.",
                multi: false
            },
            {
                id: 51,
                question: "What can you include in the Email Client Template so you can reuse them when replying to or forwarding emails?",
                options: [
                    "Outbound Actions",
                    "Email Properties",
                    "Notification Filters",
                    "Attachments"
                ],
                answer: [3],
                explanation: "You can include attachments in Email Client Templates to improve productivity when replying or forwarding. This applies to response emails in a configurable workspace (reply, reply-all, forward).",
                multi: false
            },
            {
                id: 52,
                question: "Which of the following statements are true about import sets? (Select 3)",
                options: [
                    "Import Sets cannot add data to encrypted fields",
                    "Creating an extremely large import set can cause delays and system outages",
                    "The Import Set Deleter scheduled job cleans up all import set data every day at midnight",
                    "You can import data from several different file formats or external data sources",
                    "Transform map is the conversion of data from an import set table to another table"
                ],
                answer: [0, 1, 3],
                explanation: "Import Sets run as the 'System' user and cannot interact with encrypted fields. Large imports can significantly impact performance. ServiceNow supports varied sources (JDBC, HTTP, Excel, CSV, etc.). Note: The Deleter job only cleans up data older than seven days, not all data.",
                multi: true
            },
            {
                id: 53,
                question: "What are the different ways for ServiceNow tables to be related to each other? (Select 4)",
                options: [
                    "Extensions",
                    "Database Views",
                    "Many-to-Many",
                    "One-to-Many",
                    "One-to-One",
                    "Zero-to-Many"
                ],
                answer: [0, 1, 2, 3],
                explanation: "ServiceNow supports four table relationship types: Extensions (child tables sharing fields with a parent), Database Views (table joins for reporting), Many-to-Many (lists pointing to lists), and One-to-Many (parent-child reference fields).",
                multi: true
            },
            {
                id: 54,
                question: "What product lets you quickly draft knowledge articles from your workspace or classic environment based on similar cases?",
                options: [
                    "Knowledge Editor",
                    "Now Assist",
                    "Virtual Agent",
                    "Agent Assist"
                ],
                answer: [1],
                explanation: "Now Assist uses generative AI to help authors and agents draft new knowledge articles by analyzing up to five similar cases or searching specific keywords.",
                multi: false
            },
            {
                id: 55,
                question: "What scores are found on the CMDB health dashboard? (Select 3)",
                options: [
                    "Compliance",
                    "Completeness",
                    "Connectedness",
                    "Correctness"
                ],
                answer: [0, 1, 3],
                explanation: "CMDB health is measured by three scores: Completeness (required and recommended fields populated), Correctness (orphan, stale, and duplicate metrics), and Compliance (results from CMDB audit runs).",
                multi: true
            },
            {
                id: 56,
                question: "Where can you view how a catalogue item appears in a conversational interface and modify the item if required?",
                options: [
                    "In AI Search",
                    "In Service Portal",
                    "In Workspace",
                    "In Catalog Builder"
                ],
                answer: [3],
                explanation: "Catalog Builder provides a visual, guided experience to create or edit items. It allows you to preview how items appear on multiple channels including the Virtual Agent (conversational interface).",
                multi: false
            },
            {
                id: 57,
                question: "What feature facilitates synchronous collaboration within one record and allows you to see who is online, their current status, and what they view or edit in real time?",
                options: [
                    "Work note list",
                    "Collaborators",
                    "Watch list",
                    "User presence",
                    "User profile"
                ],
                answer: [3],
                explanation: "User Presence shows the avatar of users currently viewing the same record. It allows for real-time collaboration by showing who is online and active on that specific form.",
                multi: false
            },
            {
                id: 58,
                question: "Which of the following are ways to collaborate with team members on Tasks? (Select 4)",
                options: [
                    "Activity streams",
                    "Work notes",
                    "Additional comments",
                    "Connect Chat / Sidebar",
                    "User presence"
                ],
                answer: [0, 1, 3, 4],
                explanation: "Collaboration tools include User Presence (real-time visibility), Activity Streams (history of entries), Work Notes (internal communications), and Connect Chat/Sidebar (messaging). Additional comments are intended for customers, not internal collaboration.",
                multi: true
            },
            {
                id: 59,
                question: "What application enables you to discover Personally Identifiable Information (PII) within the ServiceNow instance and classify, report, or act on the PII?",
                options: [
                    "Data Privacy",
                    "Data Filtration",
                    "Data Discovery",
                    "Data Separation",
                    "Data Classification"
                ],
                answer: [2],
                explanation: "The Data Discovery [sn_data_discovery] application identifies sensitive data (like credit card numbers or emails) using customizable filters and scheduled jobs to classify, report, or act on PII.",
                multi: false
            },
            {
                id: 60,
                question: "What are the database views for incident management in the base system? (Select 3)",
                options: [
                    "incident_state",
                    "incident_sla",
                    "incident_time_worked",
                    "incident_metric"
                ],
                answer: [1, 2, 3],
                explanation: "The base system provides three standard incident database views: incident_sla (for SLA reporting), incident_metric (for performance metrics), and incident_time_worked (for labor tracking).",
                multi: true
            }
        ]
    }
};



