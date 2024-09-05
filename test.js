
const limitedConcurrency2 = async (tasks, limit) => {
    if (tasks.length<= limit) return await Promise.all(tasks.map(item => item()))
    const r =await Promise.all(tasks.splice(0,limit).map((item) => item()))
    return r.concat(await limitedConcurrency(tasks, limit))
}


const limitedConcurrency = (tasks, limit) => new Promise((resolve, reject) => {
  const tasks2 = tasks.map((item) => {
      return async (callback, index) => {
          const result = await item()
          stack--
          list[index] = result
          console.log(list)
          callback()
      }
  })
  
  let stack = 0
  const list = []
  let index = 0
  const queue = () => {
      if(tasks2.length == 0 && stack == 0) {
          resolve(list)
      }
      while (stack < limit && tasks2.length > 0) {
          console.log(Date.now())
          const task = tasks2.shift()
          if (task) {
              task(queue, index)
              index++
              stack++
          }
      }
  }
 queue()
})

const tasks = [
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Task 1 done');
        }, 1000);
      }),
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Task 2 done');
        }, 500);
      }),
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Task 3 done');
        }, 100);
      }),
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Task 4 done');
        }, 2000);
      }),
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Task 5 done');
        }, 300);
      }),
    // 更多任务...
  ];
  

  limitedConcurrency(tasks, 2).then((results) => {
    console.log(results);
  });