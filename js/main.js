import ScheduleApi from "./api";

const Rasp = {
    data() {
      return {
        tabs: ['group', 'user', 'all'],
        activeTab: ['group'],
		rasp: [],
		submite: false, 
		callings:{
			1: ' 08:25 <br> 10:00',
			2: ' 10:10 <br> 11:45',
			3: ' 12:15 <br> 13:50',
			4: ' 14:00 <br> 15:35',
			5: ' 15:45 <br> 17:20',
			6: ' 17:30 <br> 19:05',
			7: ' 19:15 <br> 20:50',
			'1.1': ' 08:25 <br> 09:10',
			'1.2': ' 09:15 <br> 10:00',
			'2.1': ' 10:10 <br> 10:55',
			'2.2': ' 11:00 <br> 11:45',
			'3.1': '12:15 <br> 13:00',
			'3.2': '13:05 <br> 13:50',
			'4.1': '14:00 <br> 14:45',
			'4.2': '14:50 <br> 15:35',
			'5.1': '15:45 <br> 16:30',
			'5.2': '16:35 <br> 17:20',
			'6.1': '17:30 <br> 18:15',
			'6.2': '18:20 <br> 19:05',
			'7.1': '19:15 <br> 20:00',
			'7.2': '20:05 <br> 20:50',
		},
        selected: {
			groups: {},
			teachers: {},
			teacher: '',
            group: '',
            user: null,
            date: new Date().toISOString().split('T')[0]
        }
      }
    }, 
    methods: {
        getTab() {
            return this.activeTab[this.activeTab.length - 1];
        },

        isTab(tab) {
            return tab == this.getTab()
        },

        setTab(tab) {
            this.activeTab.push(tab)
        } ,

        submitefunc(teacher = false) {
			var requestOptions = {
				method: 'GET',
				redirect: 'follow'
			};
			
			if(teacher){
				fetch("https://asu.samgk.ru/api/schedule/teacher/"+this.selected.date+"/"+this.selected.teacher , requestOptions)
				.then(response => response.json())
				.then(result => this.rasp = result.lessons)
				.catch(error => console.log('error', error));
				
				console.log(this.rasp);
			} else {
				fetch("https://asu.samgk.ru/api/schedule/"+this.selected.group+"/"+this.selected.date , requestOptions)
				.then(response => response.json())
				.then(result => this.rasp = result.lessons)
				.catch(error => console.log('error', error));
			}
			
			
				
            this.submite = true;
        } 
    },
	created(){
		var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
		var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
		this.selected.date = followingDay.toISOString().split('T')[0];
		
		var requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};
			
		fetch("https://mfc.samgk.ru/api/groups", requestOptions)
			.then(response => response.json())
			.then(result => this.selected.groups = result)
			.catch(error => console.log('error', error));
		fetch("https://asu.samgk.ru/api/teachers", requestOptions)
			.then(response => response.json())
			.then(result => this.selected.teachers = result) 
			.catch(error => console.log('error', error));
		
	}

  }
  
  Vue.createApp(Rasp).mount('#raspapp')