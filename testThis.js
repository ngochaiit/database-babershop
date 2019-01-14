var data = [
    {name: "Samantha", age: 12},
    {name: "Alexis", age: 14}
];

var user = {
    // data ở đây là một thuộc tính của đối tượng user
    data: [
        {name: "T. Woods", age: 37},
        {name: "P. Mickelson", age: 43}
    ],

    showData: function(event) {
        // chọn ngẫu nhiên 0 hoặc 1
        var randomNum = ((Math.random() * 2 | 0) + 1) - 1;

        // In ra một người chọn ngẫu nhiên từ user.data
        console.log(this.data[randomNum].name + " " + this.data[randomNum].age);
    }
}


var showUserData = user.showData.bind(user);

// Bây giờ chúng ta sẽ lấy giá trị từ đối tượng user, vì "this" đã
// được gán cho đối tượng này:
showUserData(); // P. Mickelson 43