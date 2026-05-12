import { useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import ChevronLeft from '../../../../assets/icons/common/ChevronLeft';
import stickerImg from '../../../../assets/images/sticker.png';
import '../../styles/withdraw/WithdrawPage.css';

function makeBarcodePattern(seed) {
  const pattern = [
    { barWidth: 10, gap: 1 },
    { barWidth: 8, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 10, gap: 2 },
    { barWidth: 8, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 3, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
  ];

  const offset = Math.abs(seed % pattern.length);
  return pattern.slice(offset).concat(pattern.slice(0, offset));
}

const TYPE_LABEL = {
  happy: '행복저금',
  become: '행복해지는 저금',
};

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatReceiptDate(dateStr) {
  const date = new Date(String(dateStr).replace(/\./g, '-'));
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatReceiptTime(record) {
  const timeSource = record?.createdAt ?? record?.time ?? record?.id;
  const date = new Date(timeSource);

  if (Number.isNaN(date.getTime())) {
    return '--:--:--';
  }

  return date.toTimeString().slice(0, 8);
}

function WithdrawPage({ onBack, bankInfo, records = [] }) {
  const exportRef = useRef(null);
  const isDownloadingRef = useRef(false);

  const randomRecord = useMemo(() => {
    if (records.length === 0) return null;
    return records[Math.floor(Math.random() * records.length)];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const barcodePattern = useMemo(
    () => (randomRecord ? makeBarcodePattern(randomRecord.id) : []),
    [randomRecord]
  );

  const handleDownload = async () => {
    if (!exportRef.current || !randomRecord || isDownloadingRef.current) return;

    isDownloadingRef.current = true;

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: null,
        scale: Math.max(window.devicePixelRatio || 1, 2),
        useCORS: true,
      });

      const link = document.createElement('a');
      const safeDate = String(randomRecord.date ?? 'receipt').replace(/[^\w-]+/g, '-');
      link.download = `lagom-receipt-${safeDate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download receipt PNG.', error);
    } finally {
      isDownloadingRef.current = false;
    }
  };

  const renderReceiptContent = (exportMode = false) => (
    <>
      <h2 className="withdrawPage__receiptTitle">
        Lagom&apos;s
        <br />
        Happiness RECEIPT
      </h2>

      <p className="withdrawPage__receiptDate">
        {formatReceiptDate(randomRecord.date)}
      </p>

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">저금유형</span>
          <span className="withdrawPage__infoValue">
            {TYPE_LABEL[randomRecord.type] ?? '행복저금'}
          </span>
        </div>
        <div className="withdrawPage__infoRow">
          {/* 닉네임 생성되면 입금자명 닉네임으로 넣기 */}
          <span className="withdrawPage__infoLabel">입금자명</span>
          <span className="withdrawPage__infoValue">
            {bankInfo?.userName ?? bankInfo?.name ?? '나'}
          </span>
        </div>
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">저금시간</span>
          <span className="withdrawPage__infoValue">
            {formatReceiptTime(randomRecord)}
          </span>
        </div>
      </div>

      <div className={exportMode ? 'withdrawPage__dashed withdrawPage__dashed--export' : 'withdrawPage__dashed'} />

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">입금 내용</span>
          <span className="withdrawPage__infoValue">{randomRecord.memo}</span>
        </div>
      </div>

      <div className={exportMode ? 'withdrawPage__dashed withdrawPage__dashed--export' : 'withdrawPage__dashed'} />

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">태그작성</span>
          <span className="withdrawPage__infoValue">
            {randomRecord.hashtag || '-'}
          </span>
        </div>
      </div>

      <div className={exportMode ? 'withdrawPage__dashed withdrawPage__dashed--export' : 'withdrawPage__dashed'} />

      <div className="withdrawPage__total">
        <span className="withdrawPage__totalLabel">TOTAL</span>
        <span className="withdrawPage__totalAmount">
          ₩{Number(randomRecord.amount ?? 0).toLocaleString()}
        </span>
      </div>

      <div className="withdrawPage__barcode" aria-hidden="true">
        {barcodePattern.map(({ barWidth, gap }, i) => (
          <span
            key={i}
            className="withdrawPage__barcodeBar"
            style={{ width: `${barWidth}px`, marginRight: `${gap}px` }}
          />
        ))}
      </div>
    </>
  );

  if (!randomRecord) return null;

  return (
    <div className="withdrawPage">
      <div className="withdrawPage__header">
        <button
          className="withdrawPage__backBtn"
          onClick={onBack}
          type="button"
          aria-label="뒤로가기"
        >
          <ChevronLeft />
        </button>
        <button className="withdrawPage__deleteBtn" type="button">
          삭제하기
        </button>
      </div>

      <div className="withdrawPage__scroll">
        <div className="withdrawPage__receiptOuter">
          <img
            className="withdrawPage__stickerImg"
            src={stickerImg}
            alt=""
            aria-hidden="true"
          />
          <div className="withdrawPage__receipt">
            {renderReceiptContent(false)}
          </div>
        </div>
      </div>

      <button
        className="withdrawPage__downloadBtn"
        type="button"
        onClick={handleDownload}
      >
        다운로드
      </button>

      <div className="withdrawPage__exportCapture" aria-hidden="true">
        <div className="withdrawPage__exportCanvas" ref={exportRef}>
          <div className="withdrawPage__receiptOuter withdrawPage__receiptOuter--export">
            <img
              className="withdrawPage__stickerImg withdrawPage__stickerImg--export"
              src={stickerImg}
              alt=""
            />
            <div className="withdrawPage__receiptTopExport" />
            <div className="withdrawPage__receipt withdrawPage__receipt--export">
              {renderReceiptContent(true)}
            </div>
            <div className="withdrawPage__receiptBottomExport" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
