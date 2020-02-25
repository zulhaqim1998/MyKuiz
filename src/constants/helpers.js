export const getFirebaseQueryData = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
        const d = doc.data();
        d.id = doc.id;
        data.push(d);
    });
    return data;
};

export const convertClassroomData = firebaseData => {

    return ({
        name: firebaseData.nama,
        section: firebaseData.bahagian,
        subject: firebaseData.subjek,
        room: firebaseData.bilik,
        teacherId: firebaseData.teacherId,
        participants: firebaseData.participants,
        schoolId: firebaseData.schoolId
    })
};
