const test = () => {
    var cReceiverList = new Array();
    var userCouponCnt = [
        { recommendation: 'kshyeon123@gmail.com', cnt: 3 },
        { recommendation: 'zpdldh434@gmail.com', cnt: 5 },
        { recommendation: 'logo1234@gmail.com', cnt: 8 },
        { recommendation: 'aaa@gmail.com', cnt: 4 },
        { recommendation: 'bbb@gmail.com', cnt: 7 },
    ]
    userCouponCnt.map((data) => {
        if (data.cnt >= 5) {
            cReceiverList.push(data);
        }
    });
    var rawArray = new Array();
    'SELECT * FROM (SELECT recommend_seq FROM tb_recommend_codes WHERE recommendation IN ('kshyeon123@gmail.com') ORDER BY recommend_seq ASC limit 0, 5) as P;'
    cReceiverList.map((data) => {
        rawArray.push(data.recommendation);
    });

}
test();