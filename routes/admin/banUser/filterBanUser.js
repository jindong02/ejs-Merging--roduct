const filterBanUser = async (req, res) => {
  try {
    const { reason, archived } = req.body;

    if (
      !['all', 'scam', 'blackmail', 'information', 'other'].includes(reason)
    ) {
      throw new Error('Invalid type to report');
    }

    if (!['all', 'true', 'false'].includes(archived)) {
      throw new Error('Invalid type to report');
    }

    res.redirect(
      `/admin/ban-user?reportsPage=1${reason !== 'all' ? `&reason=${reason}` : ''}${archived !== 'all' ? `&archived=${archived}` : ''
      }`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { filterBanUser };
