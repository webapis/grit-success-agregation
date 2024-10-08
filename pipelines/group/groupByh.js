const stages=[
  {
    $group: {
      _id: {
        h1: "$h1",
        h2: "$h2",
        h3: "$h3",
        h4: "$h4",
        h5: "$h5"
      },
      items: {
        $push: {
          _id: "$_id",
          title: "$title",
          price: "$price",
          link: "$link",
          currency: "$currency",
          pageTitle: "$pageTitle",
          pageUrl: "$pageUrl"
        }
      }
    }
  },
  {
    $group: {
      _id: {
        h1: "$_id.h1",
        h2: "$_id.h2",
        h3: "$_id.h3",
        h4: "$_id.h4"
      },
      h5: {
        $push: {
          h5: "$_id.h5",
          items: "$items"
        }
      }
    }
  },
  {
    $group: {
      _id: {
        h1: "$_id.h1",
        h2: "$_id.h2",
        h3: "$_id.h3"
      },
      h4: {
        $push: {
          h4: "$_id.h4",
          h5: "$h5"
        }
      }
    }
  },
  {
    $group: {
      _id: {
        h1: "$_id.h1",
        h2: "$_id.h2"
      },
      h3: {
        $push: {
          h3: "$_id.h3",
          h4: "$h4"
        }
      }
    }
  },
  {
    $group: {
      _id: "$_id.h1",
      h2: {
        $push: {
          h2: "$_id.h2",
          h3: "$h3"
        }
      }
    }
  }
]

  export default stages