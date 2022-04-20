const ScheduleApi = {
    getScheduleByGroup(groupId, date) {
		return fetch(`https://asu.samgk.ru/api/schedule/${groupId}/${date}`, {method: 'GET'})
					.then(response => response.json())
					.catch(error => console.log('error', error));
	},
	getScheduleByUser(userId, date) {
		return fetch(`https://asu.samgk.ru/api/schedule/teacher/${date}/${userId}`, {method: 'GET'})
				.then(response => response.json())
				.catch(error => console.log('error', error));
	}
}

const PresetValues = {
	callings: {
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

	//Список корпусов
	buildings: [
		{
			id: 1,
			name: "Первый корпус",
			groups: [133, 137, 174, 186, 183, 187, 188,
				200, 201, 202, 203, 204, 235, 242, 32,
				254, 255, 256, 257, 258, 259, 260,
				128, 176, 199, 248, 205, 261, 156, 182,
				132, 175, 228, 253, 140]
		}
	]
}

const Rasp = {
    data() {
      return {
        tabs: ['group', 'user', 'building', 'cabinet'],
        activeTab: 'group',
		rasp: [],
		submite: false,
		callings: PresetValues.callings,
		data: {
			groups: {},
			teachers: {},
			buildings: PresetValues.buildings,
			cabinets: {}
		},
        selected: {
			teacher: '',
            group: '',
			building: '',
			cabinet: '',
            date: new Date().toISOString().split('T')[0]
        }
      }
    }, 
    methods: {
        isTab(tab) {
            return tab === this.activeTab;
        },
        setTab(tab) {
            this.activeTab = tab;
        },

        load() {
			switch (this.activeTab) {
				case 'group': {
					ScheduleApi.getScheduleByGroup(this.selected.group, this.selected.date)
						.then(result => this.rasp = result.lessons);

					//console.log(this.rasp);
					break;
				}
				case 'user': {
					ScheduleApi.getScheduleByUser(this.selected.teacher, this.selected.date)
						.then(result => this.rasp = result.lessons);

					//console.log(this.rasp);
					break;
				}
				case 'building': {
					this.rasp = [];

					//Максимально отвратное решение но других методов апи нету
					//Разраб оригинального сайта, если ты это читаешь то сделай нормальный метод и переделай это !!!
					let building = this.data.buildings.find(x => x.id == this.selected.building);

					//Проходимся по всем групппах из корпуса
					building.groups.forEach(group => {
						//Получаем данные по группе
						ScheduleApi.getScheduleByGroup(group, this.selected.date)
							.then(result => {
								//Сначала закидываем заголовок с названием группы
								let fGroup = this.data.groups.find(x => x.id == group);
								this.rasp.push({name: fGroup.name, isHeader: true});

								//Потом уже данные по расписанию
								result.lessons.forEach(data => this.rasp.push(data));
							});
					});
					break;
				}
				case 'cabinet': {
					//TODO
					break;
				}
			}
			this.submite = true;
        },
		warn() {
			this.requestWarn = true;
		}
    },
	created() {
		var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
		var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
		this.selected.date = followingDay.toISOString().split('T')[0];
		
		var requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};
			
		fetch("https://mfc.samgk.ru/api/groups", requestOptions)
			.then(response => response.json())
			.then(result => this.data.groups = result)
			.catch(error => console.log('error', error));
		fetch("https://asu.samgk.ru/api/teachers", requestOptions)
			.then(response => response.json())
			.then(result => this.data.teachers = result)
			.catch(error => console.log('error', error));
	}

  }
  
  Vue.createApp(Rasp).mount('#raspapp')